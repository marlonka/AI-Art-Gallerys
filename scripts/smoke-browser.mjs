import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const viteCli = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const blockedRemoteHosts = /(fonts\.googleapis\.com|fonts\.gstatic\.com|upload\.wikimedia\.org|commons\.wikimedia\.org)/i;
const allowedLocalHosts = new Set(['127.0.0.1', 'localhost']);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

function waitForHttp(url, timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const poll = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on('error', () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for preview server at ${url}`));
          return;
        }

        setTimeout(poll, 250);
      });
    };

    poll();
  });
}

async function run() {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const preview = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: projectRoot,
    stdio: 'pipe',
    windowsHide: true,
  });

  let browser;
  const consoleErrors = [];
  const pageErrors = [];
  const blockedRequests = [];
  const remoteRequests = [];

  try {
    await waitForHttp(baseUrl);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('request', (request) => {
      const requestUrl = new URL(request.url());
      const resourceType = request.resourceType();

      if (!allowedLocalHosts.has(requestUrl.hostname)) {
        remoteRequests.push(request.url());
      }

      if (blockedRemoteHosts.test(requestUrl.hostname)) {
        blockedRequests.push(request.url());
      }

      if ((resourceType === 'font' || resourceType === 'image') && !allowedLocalHosts.has(requestUrl.hostname)) {
        blockedRequests.push(request.url());
      }
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    assert.equal(await page.locator('html').getAttribute('lang'), 'de');
    assert.equal(await page.evaluate(() => window.localStorage.getItem('inner-aiye-language')), null);
    assert.equal(await page.locator('text=KI GENERATOR').first().isVisible(), true);
    assert.equal(await page.getByText('Blicke, die zurücksehen').isVisible(), true);
    assert.equal(await page.getByRole('button', { name: /Mona Lisa von Leonardo da Vinci öffnen/i }).isVisible(), true);

    await page.locator('.language-option[lang="en"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.evaluate(() => window.localStorage.getItem('inner-aiye-language')), 'en');
    assert.equal(await page.getByText('Faces That Watch Back').isVisible(), true);
    assert.equal(await page.getByRole('button', { name: /Open Mona Lisa/i }).isVisible(), true);

    await page.getByRole('button', { name: /Open Mona Lisa/i }).click();
    await page.locator('#detail-title').waitFor();
    assert.equal(await page.locator('#detail-title').innerText(), 'Mona Lisa');

    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#detail-title').innerText(), 'Girl with a Pearl Earring');

    await page.getByRole('button', { name: /^Next$/i }).click();
    assert.equal(await page.locator('#detail-title').innerText(), 'The Arnolfini Portrait');

    await page.keyboard.press('Escape');
    await page.locator('.detail-shell').waitFor({ state: 'detached' });
    await page.locator('.language-option[lang="de"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'de');
    assert.equal(await page.evaluate(() => window.localStorage.getItem('inner-aiye-language')), 'de');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });

    const mobileArtworkLabels = await page.locator('.artwork-layer-incoming .artwork').evaluateAll((buttons) =>
      buttons.slice(0, 3).map((button) => button.getAttribute('aria-label')),
    );

    assert.deepEqual(mobileArtworkLabels, [
      'American Gothic von Grant Wood öffnen, 1930',
      'Das Mädchen mit dem Perlenohrring von Johannes Vermeer öffnen, 1665',
      'Mona Lisa von Leonardo da Vinci öffnen, 1503-1519',
    ]);

    await page.getByText('Impressum & Datenschutz').click();
    assert.equal(await page.getByRole('heading', { name: /Datenschutzerkl.rung/ }).isVisible(), true);
    assert.equal(await page.getByText('wint.global GmbH').isVisible(), true);
    assert.equal(await page.getByText('inner-aiye-language').isVisible(), true);

    assert.deepEqual(blockedRequests, []);
    assert.deepEqual(remoteRequests, []);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
