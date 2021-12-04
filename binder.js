const fs = require('fs'); //Built-in dependency for file streaming.
const solc = require('solc'); //Solidity compiler

const content = fs.readFileSync('smart-contract.sol', 'utf-8'); // Read the file...

// Format the input for solc compiler:
const input = {
  language: 'Solidity',
  sources: {
    'smart-contract.sol' : {
      content, // The imported content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}; 

const output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(output); // Log output from compiler
