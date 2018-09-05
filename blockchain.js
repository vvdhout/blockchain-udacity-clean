/* =========== Blockchain class that contains =========== 
1. *a constructor that adds a genesis block if the chain does not exist yet
2. *addBlock function that adds a new block to the chain containing custom data
3. *getHeight function to get the current height of the chain
4. getBlock function that gets a block object using its height
5. validateBlock function that checks if the hash of the block is valid
6. validateChain function that checks if the hash of each block in the chain is valid as well as checks if the previousBlockHash matches the actual hash of the previous block in the chain.
*/

/* =========== Block class that contains the following keys ===========
- time
- height
- previousBlockHash
- data
- hash
*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chainDB';
const db = level(chainDB, {valueEncoding: 'json'})

class Blockchain {
	constructor() {
		this.getHeight().then((chainHeight) => {
			if(chainHeight === -1) {
				this.addBlock(new Block('This is the genesis block.')).then(() => {
					console.log('Blockchain is set up and genesis block has been added.')
				})
			}
		})
	}


	async addBlock(newBlock) {
		let chainHeight = await this.getHeight();
		if(chainHeight > -1) {
			let previousBlock = await this.getBlock(chainHeight);
			newBlock.previousBlockHash = previousBlock.hash;
		}
		newBlock.height = chainHeight + 1; 
		newBlock.time = new Date().getTime().toString().slice(0,-3);
		newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
		await this.addBlockToDB(newBlock.height, newBlock);
		return Promise.resolve(newBlock);
	}


	async getHeight() {
		return await this.getChainHeightFromDB();
	}


	async getBlock(height) {
		return await this.getBlockFromDB(height);
	}

	async deleteBlock(height) {
		db.del(height).then(() => {
			console.log(`Deleted block #${height}.`);
		})
	}

	async validateBlock(height) {
		let block = await this.getBlock(height);
		let blockHash = block.hash;
		block.hash = '';
		let validHash = SHA256(JSON.stringify(block)).toString();
		if(blockHash === validHash) {
			return true
		}
		else {
			console.log(`WARNING: Block #${height} has an invalid hash.`);
			return false
		}
	}

	async validateChain() {
		let errorLog = []
		let chainTempHeight = await this.getHeight();

		for(let i = 1; i < chainTempHeight + 1; i ++) {

			let hasValidHash = await this.validateBlock(i);
			let block = await this.getBlock(i);
			let prevBlock = await this.getBlock(i-1);

			if(!hasValidHash) {
				errorLog.push(i);
			}

			if(prevBlock.hash !== block.previousBlockHash) {
				errorLog.push(i);
				console.log(`WARNING: the value of previousBlockHash of block #${i} does not match the hash of the previous block (#${i-1}).`);
			}

			if(i === chainTempHeight) {
				if(errorLog.length > 0 ) {
					console.log(`WARNING: We have found ${errorLog.length} errors!`);
					console.log(errorLog);
				}
				else {
					console.log(`The blockchain validation has been completed and no errors have been found.`);
				}
			}

		}
	}


	addBlockToDB(key, value) {
		return new Promise((resolve, reject) => {
			db.put(key, value, function(err) {
				if (err) {
					reject('WARNING: An error occured when trying to add data to levelDB.')
				}
				else {
					console.log(`Added block #${key} to the blockchain.`)
					resolve(true);
				}
			})
		})
	}


	getBlockFromDB(key) {
		return new Promise((resolve,reject) => {
			db.get(key, function(err, value) {
				if(err) {
					console.log('WARNING: An error occured when trying to get block data from levelDB.');
					reject(err);
				}
				else {
					resolve(value);
				}
			})
		})
	}


	getChainHeightFromDB() {
		return new Promise((resolve,reject) => {
			let height = -1;
			let stream = db.createReadStream();
			stream.on('data', function(data) {
				height ++;
			}).on('error', function(err) {
				reject(err)
			}).on('close', () => {
				resolve(height)
			})
		})
	}


}


class Block {
	constructor(data) {
		this.time = 0;
		this.height = 0;
		this.previousBlockHash = '';
		this.hash = '';
		this.data = data;
	}
}

module.exports.blockchain = Blockchain;
module.exports.block = Block; 