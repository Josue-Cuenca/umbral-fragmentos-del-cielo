@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 20 o superior y vuelve a abrir este archivo.
  pause
  exit /b 1
)
start "Servidor UMBRAL - mantener abierto" cmd /k node scripts/server.mjs
timeout /t 2 /nobreak >nul
start "" http://localhost:4174
