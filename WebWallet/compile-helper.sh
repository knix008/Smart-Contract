#!/bin/bash

echo "🔨 Smart Contract Compilation Helper"
echo "===================================="
echo ""

# Check if compiled directory exists
if [ ! -d "compiled" ]; then
    echo "📁 Creating compiled directory..."
    mkdir compiled
fi

echo "Available contracts to compile:"
echo "1. MyToken (ERC20 with advanced features)"
echo "2. SimpleToken (Basic ERC20)"
echo "3. Both contracts"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔨 Compiling MyToken..."
        npm run compile:erc20
        ;;
    2)
        echo "🔨 Compiling SimpleToken..."
        npm run compile:simple
        ;;
    3)
        echo "🔨 Compiling both contracts..."
        npm run compile:erc20
        npm run compile:simple
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Compilation complete!"
echo ""
echo "📂 Compiled files location:"
ls -la compiled/ 2>/dev/null || echo "❌ No compiled files found. Check for compilation errors above."

echo ""
echo "💡 Next steps:"
echo "1. Use these .json files in the web interface for deployment or interaction"
echo "2. The files contain both ABI and bytecode"
echo "3. Open the web interface: http://localhost:3006"