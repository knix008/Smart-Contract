@echo off
REM DID System Startup Script for Windows
REM This script starts all components of the DID system

echo 🚀 Starting DID System Components...

REM Function to check if port is available (simplified for Windows)
REM We'll use netstat to check if ports are in use

echo Checking if we're in the right directory...
if not exist "SmartContracts" (
    echo Error: SmartContracts directory not found
    goto :error
)
if not exist "Wallet" (
    echo Error: Wallet directory not found
    goto :error
)
if not exist "Issuer" (
    echo Error: Issuer directory not found
    goto :error
)
if not exist "Verifier" (
    echo Error: Verifier directory not found
    goto :error
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    goto :error
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install npm first.
    goto :error
)

echo ✅ Prerequisites check passed!
echo.

REM Start Wallet Service
echo 💼 Starting Wallet Service...
cd Wallet
if not exist "node_modules" (
    echo Installing dependencies for Wallet...
    call npm install
)
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file for Wallet from .env.example
        copy .env.example .env
    ) else (
        echo Warning: No .env.example found for Wallet
    )
)
echo Starting Wallet on port 3001...
start "DID Wallet Service" cmd /k "npm start"
cd ..

REM Wait a bit before starting next service
timeout /t 3 /nobreak >nul

REM Start Issuer Service
echo 🏢 Starting Issuer Service...
cd Issuer
if not exist "node_modules" (
    echo Installing dependencies for Issuer...
    call npm install
)
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file for Issuer from .env.example
        copy .env.example .env
    ) else (
        echo Warning: No .env.example found for Issuer
    )
)
echo Starting Issuer on port 3002...
start "DID Issuer Service" cmd /k "npm start"
cd ..

REM Wait a bit before starting next service
timeout /t 3 /nobreak >nul

REM Start Verifier Service
echo 🔍 Starting Verifier Service...
cd Verifier
if not exist "node_modules" (
    echo Installing dependencies for Verifier...
    call npm install
)
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file for Verifier from .env.example
        copy .env.example .env
    ) else (
        echo Warning: No .env.example found for Verifier
    )
)
echo Starting Verifier on port 3003...
start "DID Verifier Service" cmd /k "npm start"
cd ..

echo.
echo 🎉 All services started!
echo.
echo 📋 Service URLs:
echo 💼 Wallet Service:    http://localhost:3001
echo 🏢 Issuer Service:    http://localhost:3002
echo 🔍 Verifier Service:  http://localhost:3003
echo.
echo 🏥 Health Check URLs:
echo 💼 Wallet Health:     http://localhost:3001/health
echo 🏢 Issuer Health:     http://localhost:3002/health
echo 🔍 Verifier Health:   http://localhost:3003/health
echo.
echo 🧪 To run integration tests:
echo cd scripts ^&^& npm install ^&^& npm test
echo.
echo ✋ Services are running in separate windows. Close those windows to stop the services.
echo.
pause
goto :end

:error
echo.
echo ❌ Startup failed. Please check the error messages above.
pause

:end