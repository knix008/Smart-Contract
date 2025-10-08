import { readFileSync, writeFileSync } from 'fs';
import solc from 'solc';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the contract file
const contractPath = process.argv[2];
if (!contractPath) {
  console.error('Usage: node compile.js <contract-path>');
  process.exit(1);
}

const fullPath = resolve(__dirname, '..', contractPath);
const source = readFileSync(fullPath, 'utf8');

// Prepare the input for the Solidity compiler
const input = {
  language: 'Solidity',
  sources: {
    [contractPath]: {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
      }
    }
  }
};

// Import callback to resolve dependencies
function findImports(path) {
  try {
    if (path.startsWith('@openzeppelin/')) {
      const importPath = resolve(__dirname, '..', 'node_modules', path);
      const content = readFileSync(importPath, 'utf8');
      return { contents: content };
    }
    return { error: 'File not found' };
  } catch (error) {
    return { error: error.message };
  }
}

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

// Check for errors
if (output.errors) {
  const errors = output.errors.filter(e => e.severity === 'error');
  if (errors.length > 0) {
    console.error('Compilation errors:');
    errors.forEach(err => console.error(err.formattedMessage));
    process.exit(1);
  }

  // Show warnings
  const warnings = output.errors.filter(e => e.severity === 'warning');
  if (warnings.length > 0) {
    console.warn('Compilation warnings:');
    warnings.forEach(warn => console.warn(warn.formattedMessage));
  }
}

// Output the compiled contract
const contractFile = contractPath.split('/').pop();
const contractName = Object.keys(output.contracts[contractPath])[0];
const contract = output.contracts[contractPath][contractName];

const result = {
  contractName: contractName,
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object,
  deployedBytecode: contract.evm.deployedBytecode.object
};

console.log(JSON.stringify(result, null, 2));

// Optionally save to file
const outputPath = resolve(__dirname, '..', 'compiled', `${contractName}.json`);
writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.error(`\nCompilation successful! Output saved to: compiled/${contractName}.json`);
