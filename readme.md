# local-ethereum-dapp  
Create a full ethereum blockchain locally and run dapps and smart contracts on it  

## Setup 🧰 
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
<br>  

## Creating your smart contract 📑  
```bash
touch smart-contract.sol
```  
Copy and paste the code below into the newly created file  
```c++
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

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
<br>

## Add binding module and compile our smart contract  
To compile our smart contract we need to make sure that our project can utilize the solidity compiler. You can install it with the following command  
```bash
npm i solc --save
```  
Once it's done installing, you can start coding your ```binder.js``` file<br>  
```bash
touch binder.js  
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
<br>  

## Implement the web3 API  
In this step we're going to implement an API-library called web3.js in order to handle requests to and from our blockchain in a seamless way  
![Blockchain API Flow!](assets/images/blockchain-api-flow.png)  
Install web3 for your project using the following command  
```bash
npm i web3 --save
```  
We can now extend our already existing ```binder.js```with the following code  
```js
const Web3 = require('web3');  

//Rest of your code...

//Set up a http provider which communicates on the port you started the ganache-cli on, in my case it is 8545
const provider = new Web3.providers.HttpProvider("http://localhost:8545");  

//Connect to your blockchain and save the connection object as web3
const web3 = new Web3(provider);
```  
So, now we have implemented the web3 API to our program. The next step is to deploy the smart contract to an address on the blockchain 👍  
<br>  

## Deploy your smart contract  
Now that our file can connect to the local blockchain via web3, we want to upload our newly-created contract to an address on the network.  
<br>
In order to do that, we first need to use web3 to create a Contract object out of our compiled code. This will make it much easier to interact with our contract.  
Extend ```binder.js``` with the following code  
```js
//Rest of the code 

// Get the compiled contract's abi (interface)
//ABI = Application Binary Interface
const { SmartContract } = output.contracts["smart-contract.sol"]
const { abi, evm } = HelloWorld // We'll use the "evm" variable later
 
// Initialize a new contract object:
const contract = new web3.eth.Contract(abi);

console.log(contract);
```
  
Now, in order to deploy this contract to an address, we need to use gas and spend some ether by following these three steps:  
+ Get an address from our test wallet
+ Get the current gas price
+ Spend some (fake) ether from our address to deploy our HelloWorld contract to a new random address.
+ Get the deployed contract instance and call its <b>getMessage</b> function.  
  
Since a lot of web3's API is promise-based, we're going to use Node's async/await functionality to make the code more readable. We'll make sure to set the gas fee high in order to deploy it directly and since we're running a local blockchain we can just choose a high arbitrary number  
```js
//Rest of the code  

const deployAndRunContract = async () => {
  // Get the addresses of Ganache's fake wallet:
  const addresses = await web3.eth.getAccounts();
  
  // Get the current price of gas
  const gasPrice = await web3.eth.getGasPrice();

  // Deploy the HelloWorld contract (its bytecode) 
  // by spending some gas from our first address
  contract.deploy({
    data: evm.bytecode.object,
  })
  .send({
    from: addresses[0],
    gas: 1000000,
    gasPrice,
  })
  .on('confirmation', async (confNumber, receipt) => {
    const { contractAddress } = receipt
    console.log("Deployed at", contractAddress);

    // Get the deployed contract instance:
    const contractInstance = new web3.eth.Contract(abi, contractAddress)

    // Call the "getMessage" function and log the result:
    const message = await contractInstance.methods.getMessage().call();
    console.log("Result from blockchain:", message);
  })
  .on('error', (err) => {
    console.log("Failed to deploy:", error) 
  })
}

deployAndRunContract(); // Call the function
```  
Let's run our program using ```node binder.js``` and see if it works  

