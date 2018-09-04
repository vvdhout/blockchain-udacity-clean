# Private Blockchain for Udacity's Nanodegree - Async Functionality

In this folder you will find all the files and modules needed to initialize and operate the private blockchain that I have build during the Udacity Nanodegree. We started by creating a blockchain that did not persist its data, just to build out some functionality. After this, we integrated levelDB into the system in order to save and persist the chain of data. Lastly, we built a Web API to communicate with the chain, allowing interaction by means of requesting block data and adding data in a block to the chain. This functionality will be elaborated on below. 

### Feedback is always welcome

I am relatively new to the operations of NodeJS and have only recently started working with Promises and Async/Await syntax. Thus, if you see any room for improvement or have any suggestions to build out more funtionality, I would love to hear from you. I am looking to grow as a developer be it node or blockchain, and would love to connect with others that are working in this incredible field as well.

## Getting Started

Below you can find instructions to set up and operate the blockchain.

### Pre-requisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing

You can test the code by following these steps:

1: Open a command prompt or shell terminal after install node.js.

2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session

4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```

## Web API

The blockchain can now be interacted with via our web API. Here, the user will be able to request block object data from the chain by providing a block height (number) and post there own data to the chain by adding it to a new block.

Initialize and run the server:

```
node asyncChain.js
```

There are two ways of interacting with/testing the web API.

#### 1) navigate to http://localhost:8000

Here the user will be able to query block data by navigating to http://localhost:8000/block/[height], replacing [height] with an actual block height (integer/number). Note that when running the chain for the first time, only the genesis block will be generated. E.g.:

```
http://localhost:8000/block/4
```

Also, the user can add a block with their own data to the chain (and have the object be returned) by navigating to http://localhost:8000/block/add/ and entering the custom block data before submitting the form.


#### 2) Using a software like Postman or a CURL

Baseurl: http://localhost:8000

- GET request (replacing [height] with an actual block height (integer/numer))
/block/[height]. E.g.:

```
curl http://localhost:8000/block/0

```

- POST (adding a string to the '_data' parameter/key that the user wants added to the block.)

```
curl -X "POST" "http://localhost:8000/block/adding" -H 'Content-Type: application/json' -d $'{"_data":"Custom data to be added to the chain."}'
```
