# DID Issuer Service

A comprehensive Verifiable Credential Issuer service with a modern web interface for the Decentralized Identity (DID) ecosystem.

## 🌟 Overview

The DID Issuer Service is a Node.js application that provides both REST API endpoints and a web-based interface for issuing, managing, and tracking Verifiable Credentials on the Ethereum blockchain (Sepolia testnet).

## 🚀 Features

### Web Interface
- **Modern Dashboard**: Real-time statistics and credential overview
- **Credential Management**: Issue, view, and revoke credentials
- **Search & Filter**: Find credentials by ID, subject, or type
- **Responsive Design**: Mobile-friendly Bootstrap 5.3.0 interface
- **Interactive Forms**: Dynamic credential type-specific forms

### API Capabilities
- **Credential Issuance**: Create verifiable credentials with blockchain anchoring
- **Credential Revocation**: Revoke credentials on-chain
- **Template System**: Support for multiple credential types
- **Validation**: Comprehensive data validation and error handling
- **Rate Limiting**: Built-in protection against abuse

### Supported Credential Types
1. **University Degree** - Academic credentials with GPA and graduation details
2. **Identity Verification** - Government ID verification credentials
3. **Professional Certification** - Industry certifications and skill levels
4. **Employment Verification** - Work history and employment status

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Ethereum wallet with Sepolia testnet ETH
- Access to Sepolia testnet RPC endpoint

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure:
   ```env
   # Server Configuration
   PORT=3002
   NODE_ENV=development

   # Blockchain Configuration
   NETWORK=sepolia
   RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   PRIVATE_KEY=your_private_key_here
   DID_REGISTRY_ADDRESS=0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75

   # Issuer Information
   ISSUER_NAME=DID Issuer Service
   ISSUER_DESCRIPTION=Verifiable Credential Issuer for DID System
   ISSUER_DID=did:ethr:sepolia:0xYourIssuerAddress

   # Security
   JWT_SECRET=your_jwt_secret_here
   ```

## 🚦 Usage

### Quick Start with Scripts

We provide convenient startup scripts for different platforms:

#### Windows (PowerShell) - Recommended
```powershell
# Production mode
.\start.ps1

# Development mode with auto-reload
.\start.ps1 dev
```

#### Windows (Command Prompt)
```cmd
# Production mode
start.bat

# Development mode
start.bat dev
```

#### Linux/macOS (Bash)
```bash
# Make script executable (first time only)
chmod +x start.sh

# Production mode
./start.sh

# Development mode
./start.sh dev
```

### Manual Start

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Setup (install dependencies and check environment)
npm run setup
```

The service will start on `http://localhost:3002`

### Web Interface

Access the web interface at: **http://localhost:3002/web**

#### Dashboard Features:
- **Statistics Panel**: View total, active, revoked credentials and types
- **Quick Actions**: Issue new credentials, refresh data
- **Filter Controls**: Filter by status (All, Active, Revoked)
- **Search Bar**: Search by credential ID, subject DID, or type

#### Issuing Credentials:
1. Click "Issue New Credential" button
2. Fill in the subject DID
3. Select credential type from dropdown
4. Complete type-specific fields
5. Set expiration date
6. Submit to blockchain

#### Managing Credentials:
- **View Details**: Click "View Details" to see full credential JSON
- **Revoke**: Click "Revoke" to permanently revoke credentials
- **Blockchain Links**: Click transaction links to view on Etherscan

### API Endpoints

#### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "issuer",
  "password": "issuer123"
}
```

#### Credential Operations
```http
# Issue a new credential
POST /api/credentials/issue
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjectDID": "did:ethr:sepolia:0x...",
  "credentialType": "UniversityDegree",
  "credentialSubject": {
    "id": "did:ethr:sepolia:0x...",
    "university": "Example University",
    "degree": "Bachelor of Science",
    "graduationDate": "2023-06-15",
    "gpa": "3.8"
  },
  "expirationDate": "2025-06-15T00:00:00.000Z"
}

# Get all issued credentials
GET /api/credentials

# Get specific credential
GET /api/credentials/:credentialId

# Revoke a credential
POST /api/credentials/:credentialId/revoke

# Verify credential signature
GET /api/credentials/:credentialId/verify
```

#### Issuer Information
```http
# Get issuer information
GET /api/issuer/info

# Get credential templates
GET /api/issuer/templates

# Get specific template
GET /api/issuer/templates/:type
```

## 📁 Project Structure

```
Issuer/
├── src/
│   ├── index.js              # Main server file
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── credentials.js   # Credential management routes
│   │   └── issuer.js        # Issuer information routes
│   └── services/
│       └── IssuerService.js # Core business logic
├── public/                   # Web interface files
│   ├── index.html           # Main web interface
│   ├── app.js              # Frontend JavaScript
│   └── styles.css          # Custom styling
├── start.ps1               # PowerShell startup script
├── start.bat               # Windows batch startup script  
├── start.sh                # Unix/Linux bash startup script
├── .env                     # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🚀 Startup Scripts

The project includes three startup scripts for different environments:

### start.ps1 (PowerShell - Recommended for Windows)
- **Features**: Colored output, comprehensive environment checks, automatic dependency installation
- **Environment Check**: Validates Node.js, npm, required files, and environment variables
- **Auto-Setup**: Creates .env from template if missing, installs dependencies automatically
- **Usage**: `.\start.ps1` or `.\start.ps1 dev`

### start.bat (Windows Batch)
- **Features**: Basic checks, simple output, Windows-native
- **Compatibility**: Works on all Windows systems without PowerShell
- **Usage**: `start.bat` or `start.bat dev`

### start.sh (Unix/Linux Bash)
- **Features**: Colored output, comprehensive checks, Unix-style
- **Compatibility**: Linux, macOS, WSL, Git Bash
- **Usage**: `./start.sh` or `./start.sh dev`

All scripts provide:
- ✅ Dependency validation (Node.js, npm)
- ✅ Automatic dependency installation
- ✅ Environment file setup
- ✅ Configuration validation
- ✅ Service startup with proper modes

## 🎨 Web Interface Components

### Dashboard
- **Statistics Cards**: Real-time credential metrics
- **Control Panel**: Search, filter, and action buttons
- **Credential Grid**: Responsive card layout for credentials

### Forms
- **Dynamic Fields**: Type-specific form generation
- **Validation**: Client and server-side validation
- **Date Pickers**: User-friendly date selection

### Modals
- **Issue Modal**: Comprehensive credential creation form
- **Detail Modal**: Full credential JSON viewer
- **Confirmation Dialogs**: Secure action confirmations

## 🔧 Configuration

### Credential Templates

Add new credential types by extending the template system in `IssuerService.js`:

```javascript
const credentialTemplates = {
  'YourCredentialType': {
    name: 'Your Credential Name',
    description: 'Description of the credential',
    requiredFields: ['field1', 'field2'],
    optionalFields: ['field3']
  }
};
```

### Styling Customization

Modify `public/styles.css` to customize the appearance:
- CSS variables for colors and spacing
- Component-specific styling
- Responsive breakpoints
- Animation effects

## 🔐 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configurable cross-origin policies
- **Error Handling**: Secure error messages
- **Authentication**: JWT-based authentication system

## 🧪 Testing

```bash
# Run unit tests
npm test

# Check service health
curl http://localhost:3002/health
```

## 📊 Monitoring

The service includes:
- Health check endpoint (`/health`)
- Request logging
- Error tracking
- Performance metrics

## 🐛 Troubleshooting

### Common Issues

1. **Service won't start**
   - Check if port 3002 is available
   - Verify all environment variables are set
   - Ensure dependencies are installed

2. **Blockchain connection issues**
   - Verify RPC_URL is accessible
   - Check private key format
   - Ensure sufficient Sepolia ETH for gas

3. **Web interface not loading**
   - Confirm service is running on port 3002
   - Check browser console for JavaScript errors
   - Verify static files are being served

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the DID ecosystem and follows the main project's licensing terms.

## 🔗 Related Services

- **Smart Contracts**: Core DID Registry contract
- **Wallet Service**: DID and key management
- **Verifier Service**: Credential verification
- **Documentation**: Main project README

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the main repository

---

**Built with ❤️ for the Decentralized Identity ecosystem**