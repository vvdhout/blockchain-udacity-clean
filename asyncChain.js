const chainExport = require('./blockchain.js');
const Blockchain = chainExport.blockchain;
const Block = chainExport.block;
const chain = new Blockchain();

// chain.addBlock(new Block('Test: data here.'));

// chain.validateBlock(2);

// chain.validateChain();