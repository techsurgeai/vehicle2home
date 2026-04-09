@echo off
cd /d "%~dp0"
start "Vehicle2Home Local Server" powershell -NoExit -ExecutionPolicy Bypass -Command "& 'C:\Program Files\nodejs\node.exe' 'server.js'"
