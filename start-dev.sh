#!/bin/bash

echo "Starting YourGPT Development Server..."

# Kill any existing processes on the ports we need
echo "Cleaning up existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:8003 | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

echo "Starting backend server on port 8003..."
cd backend/src && node --experimental-loader=ts-node/esm --loader=ts-node/esm server.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

echo "Starting frontend server on port 5173..."
cd ../.. && npx vite &
FRONTEND_PID=$!

echo "Servers started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8003"

# Wait for any process to exit
wait $BACKEND_PID $FRONTEND_PID
