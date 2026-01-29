@echo off
echo ========================================
echo  BCM Business Continuity Management
echo  HTTP Server - Port 8081
echo ========================================
echo.
echo  [92mServer aadress: http://localhost:8081[0m
echo.
echo  Ava brauser ja mine aadressile:
echo  http://localhost:8081
echo.
echo  Sulgemiseks vajuta Ctrl+C
echo ========================================
echo.
cd /d "%~dp0"
python -m http.server 8081
