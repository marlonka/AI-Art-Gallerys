import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const projectRoot = process.cwd();
const artworkRoot = path.join(projectRoot, 'src', 'artworks');
const archiveRoot = path.join(artworkRoot, '_originals');
const supportedInputExtensions = new Set(['.png', '.jpg', '.jpeg']);
const webpQuality = 82;

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectInputFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '_originals') continue;
      files.push(...(await collectInputFiles(fullPath)));
      continue;
    }

    if (supportedInputExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files.sort((first, second) => first.localeCompare(second));
}

async function moveOriginal(inputPath) {
  const relativePath = path.relative(artworkRoot, inputPath);
  const archivedPath = path.join(archiveRoot, relativePath);
  await fs.mkdir(path.dirname(archivedPath), { recursive: true });

  if (!(await pathExists(archivedPath))) {
    await fs.rename(inputPath, archivedPath);
    return archivedPath;
  }

  const parsed = path.parse(archivedPath);
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const versionedPath = path.join(parsed.dir, `${parsed.name}-${timestamp}${parsed.ext}`);
  await fs.rename(inputPath, versionedPath);
  return versionedPath;
}

async function optimizeArtwork(inputPath) {
  const parsed = path.parse(inputPath);
  const outputPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const before = (await fs.stat(inputPath)).size;

  await sharp(inputPath, { failOn: 'none' })
    .rotate()
    .webp({
      quality: webpQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const after = (await fs.stat(outputPath)).size;
  const archivedPath = await moveOriginal(inputPath);

  return {
    inputPath,
    outputPath,
    archivedPath,
    before,
    after,
    savedPercent: ((before - after) / before) * 100,
  };
}

async function main() {
  if (!(await pathExists(artworkRoot))) {
    throw new Error(`Artwork folder not found: ${artworkRoot}`);
  }

  const inputFiles = await collectInputFiles(artworkRoot);

  if (!inputFiles.length) {
    console.log('No PNG/JPG/JPEG files found in src/artworks. Nothing to convert.');
    return;
  }

  console.log(`Converting ${inputFiles.length} image(s) to WebP at quality ${webpQuality}...\n`);

  for (const inputFile of inputFiles) {
    const result = await optimizeArtwork(inputFile);
    const relativeInput = path.relative(projectRoot, result.inputPath);
    const relativeOutput = path.relative(projectRoot, result.outputPath);
    const relativeArchive = path.relative(projectRoot, result.archivedPath);
    const beforeKb = (result.before / 1024).toFixed(0);
    const afterKb = (result.after / 1024).toFixed(0);

    console.log(`${relativeInput}`);
    console.log(`  -> ${relativeOutput}`);
    console.log(`  ${beforeKb} KB -> ${afterKb} KB, saved ${result.savedPercent.toFixed(1)}%`);
    console.log(`  original moved to ${relativeArchive}\n`);
  }

  console.log('Done. Run npm run build when you are ready to deploy.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
