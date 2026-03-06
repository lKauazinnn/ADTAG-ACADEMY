@echo off
title Aprendizado Unidos - Sistema Completo
color 0A
echo.
echo  ================================================
echo          APRENDIZADO UNIDOS
echo  ================================================
echo.
echo  Liberando portas do projeto (3333 e 5173)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3333 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul
echo.
echo  [1/2] Iniciando BACKEND (porta 3333)...
start "Backend - API" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 3 /nobreak >nul

echo  [2/2] Iniciando FRONTEND (porta 5173)...
start "Frontend - React" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo  ================================================
echo   SERVIDORES INICIADOS COM SUCESSO!
echo  ================================================
echo.
echo   Backend:  http://localhost:3333
echo   Frontend: http://localhost:5173
echo.
echo   Aguarde alguns segundos e acesse:
echo   http://localhost:5173
echo.
echo   Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:5173

echo.
echo  Sistema rodando! Nao feche esta janela.
echo.
pause
