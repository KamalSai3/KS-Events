@echo off
echo Starting KS Events - Advanced Event Management System
echo.

echo Starting Flask Backend Server...
start "Flask Backend" cmd /k "cd backend-flask && python app.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 🚀 KS Events is starting up!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Admin Portal: http://localhost:5173/admin
echo Student Portal: http://localhost:5173/student
echo Public Events: http://localhost:5173/
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
