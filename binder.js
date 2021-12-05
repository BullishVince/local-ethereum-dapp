const fs = require('fs'); //Built-in dependency for file streaming.
const solc = require('solc'); //Solidity compiler
const Web3 = require('web3');

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

//Set up a provider
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

//Connect to the blockchain and save the connection object as web3
const web3 = new Web3(provider);

// Get the compiled contract's abi (interface)
const { SmartContract } = output.contracts["SmartContract.sol"]
const { abi, evm } = SmartContract // We'll use the "evm" variable later
 
// Initialize a new contract object:
const contract = new web3.eth.Contract(abi);
console.log(contract);