@echo off
echo ===================================================================
echo   Starting WanderWise AI Local Preview Server (Port 3000)
echo ===================================================================
start "" "http://localhost:3000"
node "%~dp0serve_preview.js"
pause
