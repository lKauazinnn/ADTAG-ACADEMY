@echo off
cd /d "%~dp0"

echo.
echo ==========================================
echo   ADTAG - Subindo pro GitHub...
echo ==========================================
echo.

git add .

set /p MSG="Mensagem do commit (ou Enter para mensagem automatica): "

if "%MSG%"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set DATA=%%c-%%b-%%a
    for /f "tokens=1-2 delims=: " %%a in ("%time%") do set HORA=%%a:%%b
    set MSG=Update %DATA% %HORA%
)

git commit -m "%MSG%"
git push origin main

echo.
echo ==========================================
echo   Subiu com sucesso!
echo ==========================================
echo.
pause
