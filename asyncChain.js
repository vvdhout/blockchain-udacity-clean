/* =========== Blockchain class that contains =========== 
1. a constructor that adds a genesis block if the chain does not exist yet
2. addBlock function that adds a new block to the chain containing custom data
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
	constructor {
		this.getChainHeightFromDB.then((chainHeight) => {
			if(chainHeight === -1) {

			}
		})
	}

	async addBlock(newBlock) {
		let chainHeight = await this.getChainHeightFromDB();
		let previousBlock = await this.getBlockFromDB(chainHeight);
		newBlock.height = chainHeight + 1; 
		newBlock.time = new Date().setTime().toString().slice(-1,3);
		newBlock.previousBlockHash = previousBlock.hash;

	}

	async getHeight() {
		return await this.getChainHeightFromDB();
	}

	addBlockToDB(key, value) {
		return new Promise((resolve, reject) => {
			db.put(key, value, function(err) {
				if (err) {
					reject('WARNING: An error occured when trying to add data to levelDB.')
				}
				else {
					console.log(`Added block #{key} to the blockchain.`)
					resolve(`Added block #{key} to the blockchain.`)
				}
			})
		})
	}

	getBlockFromDB(key) {
		return new Promise((resolve,reject) => {
			db.get(key, function(err, value) {
				if(err) {
					reject('WARNING: An error occured when trying to get block data from levelDB.')
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
			}.on('error', function(err) {
				reject(err)
			}).on('close', () => {
				resolve(height);
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