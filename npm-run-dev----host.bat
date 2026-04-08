@echo off
start cmd /k "npm run dev -- --host"
timeout /t 3 >nul
start http://localhost:5173