# DID Issuer Service Startup Script (PowerShell)
# This script starts the DID Issuer service with proper environment setup

param(
    [string]$Mode = "production"
)

Write-Host "🏢 Starting DID Issuer Service..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Function to write colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-ColorOutput Green "✅ Node.js version: $nodeVersion"
} catch {
    Write-ColorOutput Red "❌ Node.js is not installed. Please install Node.js first."
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-ColorOutput Green "✅ npm version: $npmVersion"
} catch {
    Write-ColorOutput Red "❌ npm is not installed. Please install npm first."
    exit 1
}

# Get the directory where this script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-ColorOutput Blue "📂 Working directory: $ScriptDir"

# Check if package.json exists
if (!(Test-Path "package.json")) {
    Write-ColorOutput Red "❌ package.json not found. Make sure you're in the correct directory."
    exit 1
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-ColorOutput Yellow "⚠️  .env file not found. Copying from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-ColorOutput Green "✅ Created .env file from template"
        Write-ColorOutput Yellow "⚠️  Please configure your .env file with proper values before running the service"
    } else {
        Write-ColorOutput Red "❌ .env.example not found. Please create a .env file manually."
        exit 1
    }
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-ColorOutput Yellow "📦 Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Failed to install dependencies"
        exit 1
    }
    Write-ColorOutput Green "✅ Dependencies installed successfully"
}

# Load environment variables from .env file
Write-ColorOutput Blue "🔍 Checking environment configuration..."

$envVars = @{}
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*)\s*=\s*(.*)$") {
            $envVars[$matches[1]] = $matches[2]
        }
    }
}

# Check critical environment variables
$missingVars = @()

if (-not $envVars.ContainsKey("RPC_URL") -or [string]::IsNullOrWhiteSpace($envVars["RPC_URL"])) {
    $missingVars += "RPC_URL"
}

if (-not $envVars.ContainsKey("PRIVATE_KEY") -or [string]::IsNullOrWhiteSpace($envVars["PRIVATE_KEY"])) {
    $missingVars += "PRIVATE_KEY"
}

if (-not $envVars.ContainsKey("DID_REGISTRY_ADDRESS") -or [string]::IsNullOrWhiteSpace($envVars["DID_REGISTRY_ADDRESS"])) {
    $missingVars += "DID_REGISTRY_ADDRESS"
}

if ($missingVars.Count -gt 0) {
    Write-ColorOutput Yellow "⚠️  Warning: The following environment variables are not set:"
    foreach ($var in $missingVars) {
        Write-ColorOutput Yellow "   - $var"
    }
    Write-ColorOutput Yellow "   The service will start but blockchain functionality may not work properly."
}

# Display configuration
Write-ColorOutput Blue "🔧 Configuration:"
$port = if ($envVars.ContainsKey("PORT")) { $envVars["PORT"] } else { "3002" }
$network = if ($envVars.ContainsKey("NETWORK")) { $envVars["NETWORK"] } else { "sepolia" }
$nodeEnv = if ($envVars.ContainsKey("NODE_ENV")) { $envVars["NODE_ENV"] } else { "development" }
$contract = if ($envVars.ContainsKey("DID_REGISTRY_ADDRESS")) { $envVars["DID_REGISTRY_ADDRESS"] } else { "Not configured" }

Write-Host "   Port: $port"
Write-Host "   Network: $network"
Write-Host "   Environment: $nodeEnv"
Write-Host "   Contract: $contract"

Write-Host ""
Write-ColorOutput Green "🚀 Starting DID Issuer Service..."
Write-ColorOutput Blue "📱 Web Interface: http://localhost:$port/web"
Write-ColorOutput Blue "📡 API Endpoint: http://localhost:$port/api"
Write-Host ""
Write-ColorOutput Yellow "Press Ctrl+C to stop the service"
Write-Host "=================================="

# Start the service
if ($Mode -eq "dev" -or $Mode -eq "development") {
    Write-ColorOutput Blue "🔄 Starting in development mode with auto-reload..."
    npm run dev
} else {
    Write-ColorOutput Blue "🏭 Starting in production mode..."
    npm start
}