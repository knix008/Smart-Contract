@echo off
:: DID Issuer Service Startup Script (Windows Batch)
:: This script starts the DID Issuer service with basic checks

echo.
echo 🏢 Starting DID Issuer Service...
echo ==================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

:: Change to script directory
cd /d "%~dp0"

echo 📂 Working directory: %cd%

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the correct directory.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Copying from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env file from template
        echo ⚠️  Please configure your .env file with proper values before running the service
    ) else (
        echo ❌ .env.example not found. Please create a .env file manually.
        pause
        exit /b 1
    )
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

echo.
echo 🚀 Starting DID Issuer Service...
echo 📱 Web Interface: http://localhost:3002/web
echo 📡 API Endpoint: http://localhost:3002/api
echo.
echo Press Ctrl+C to stop the service
echo ==================================

:: Check command line argument for development mode
if "%1"=="dev" (
    echo 🔄 Starting in development mode with auto-reload...
    npm run dev
) else if "%1"=="development" (
    echo 🔄 Starting in development mode with auto-reload...
    npm run dev
) else (
    echo 🏭 Starting in production mode...
    npm start
)

pause