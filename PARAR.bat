@echo off
title Parar Servidores
color 0C
echo.
echo  ================================================
echo     PARANDO SERVIDORES
echo  ================================================
echo.
echo  Fechando apenas portas 3333 e 5173 do projeto...
echo  (outros projetos Node nao serao afetados)
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3333 ^| findstr LISTENING') do (
  echo  Parando processo na porta 3333 (PID: %%a)
  taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
  echo  Parando processo na porta 5173 (PID: %%a)
  taskkill /F /PID %%a >nul 2>&1
)

echo.
echo  Servidores do projeto parados!
echo.
pause
