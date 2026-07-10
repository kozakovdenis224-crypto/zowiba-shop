@echo off
chcp 65001 >nul
title ZOWIBA.SHOP - запуск сайту

cd /d "%~dp0"

echo ============================================
echo   Запускаю ZOWIBA.SHOP локально...
echo   Не закривай це вікно, поки користуєшся сайтом.
echo ============================================
echo.

call npm run dev

pause
