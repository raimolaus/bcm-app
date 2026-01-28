@echo off
echo ================================================
echo  BCM GitHub Updater
echo ================================================
echo.

cd /d C:\CLAUDE\BCM

echo Checking for changes...
git status
echo.

echo Adding all changes...
git add .
echo.

set /p message="Enter commit message (or press Enter for default): "
if "%message%"=="" set message=Update %date% %time%

echo.
echo Committing with message: %message%
git commit -m "%message%"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ================================================
echo  DONE! Changes uploaded to GitHub.
echo  GitHub Pages will update in 1-2 minutes.
echo ================================================
echo.

pause