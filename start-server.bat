@echo off
echo ========================================
echo BCM Business Continuity Management
echo Starting HTTP Server...
echo ========================================
echo.
echo Server aadress: http://localhost:8080
echo.
echo Sulgemiseks vajuta Ctrl+C
echo ========================================
echo.
cd /d "%~dp0"
python -m http.server 8080
