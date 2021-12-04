# local-ethereum-dapp  
Create a full ethereum blockchain locally and run dapps and smart contracts on it  

## Setup  
First we'll need to make sure that we have ganache-cli in place.  
Ganache is an Ethereum simulator that makes developing Ethereum applications faster, easier, and safer. It includes all popular RPC functions and features (like events) and can be run deterministically to make development a breeze.  

<b>Install ganache-cli using the following command</b> 
```bash
npm i ganache-cli -g 
```  
Once it's installed, you can check if it works by simply running the global ```ganache-cli``` command in a new terminal window  
<br>   
Create a new project which will be used to run your smart contract against your local blockchain  
```bash
mkdir local-ethereum-dapp && cd local-ethereum-dapp && npm init --yes; git init;  
```  
  
## Creating your smart contract 📑  
```bash
touch smart-contract.sol
```  
Copy and paste the code below into the newly created file  
```c++
pragma solidity ^0.5.10;

contract HelloWorld {
  string message = "Hello World";
  
  // Add this function:
  function getMessage() public view returns(string memory) {
    return message;
  }
  
  function changeMessage(string memory _newMessage) public {
    message = _newMessage;
  }
}
```  
That's it! Now we have our smart contract in place. The next step is to build the binding module which will read our program, format it, compile it using the solidity compiler and then log the output from the compiler 😄  

## Add binding module and compile our smart contract  
To compile our smart contract we need to make sure that our project can utilize the solidity compiler. You can install it with the following command  
```bash
npm i solc --save
```  
Once it's done installing, you can start coding your ```binder.js``` file<br>  
```bash
touch index.js  
```  
Copy and paste the following code into ```binder.js``` 
```js
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
```  
To compile our smart contract just run the following command  
```bash
node binder.js
```  
Easy, right? 😄  
