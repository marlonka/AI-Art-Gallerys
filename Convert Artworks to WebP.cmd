@echo off
setlocal
cd /d "%~dp0"
echo Converting PNG/JPG artwork files in src\artworks to WebP...
echo.
npm run optimize:artworks
echo.
pause
