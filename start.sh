#!/bin/bash

echo "Starting KS Events - Advanced Event Management System"
echo

echo "Starting Flask Backend Server..."
cd backend-flask
python app.py &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting React Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "🚀 KS Events is starting up!"
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Admin Portal: http://localhost:5173/admin"
echo "Student Portal: http://localhost:5173/student"
echo "Public Events: http://localhost:5173/"
echo "========================================"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
