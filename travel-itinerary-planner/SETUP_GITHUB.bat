@echo off
echo ===================================================================
echo   Pushing Travel Itinerary Planner to GitHub
echo ===================================================================
echo.
echo Please create a new repository on GitHub: https://github.com/new
echo Then paste your repository URL below (e.g. https://github.com/yourname/travel-itinerary-planner.git)
echo.
set /p REPO_URL="Enter your GitHub Repo URL: "

git init
git add .
git commit -m "feat: complete Personalized Travel Itinerary Planner with React, FastAPI, Supabase & Gemini AI"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ===================================================================
echo   Repository uploaded successfully!
echo   You can now copy your GitHub URL to MySkillWallet.
echo ===================================================================
pause
