const chainExport = require('./blockchain.js');
const Blockchain = chainExport.blockchain;
const Block = chainExport.block;
const chain = new Blockchain();

// chain.addBlock(new Block('Test: data here.'));

// chain.validateBlock(2);

// chain.deleteBlock(0);

// let clearChain = async () => {
// 	let height = await chain.getHeight();
// 	for (let i = 0; i < height + 1; i++) {
// 		chain.deleteBlock(i);
// 	}
// };
// clearChain();

// chain.validateChain();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

/* We want to set up a Web API that allows users to interact with the blockchain. More specifically,
we want them to be able to 1) get block data by entering a height, and 2) add a block to the blockchain
by entering data. This requires us to set up a get and post request respectively using the express
module. The body parser module will help us obtain body data more easily. */

app.listen(8000, () => {
	console.log('App is listening on port 8000');
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

// Setting the views folder to call files from
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Calling the home.ejs file from the views folder when on / 
app.get('/', (req, res) => { 
	res.render('home');
});

// Calling the home.ejs file from the views folder when on / 
app.get('/block/add/', (req, res) => { 
	res.render('addblock');
});

app.get('/block/:height', async (req, res) => {
	let height = req.params.height;
	let chainHeight = await chain.getHeight();

	if(height > chainHeight) {
		res.send(`That block does not yet exists. Currently, the blockchain has a height of ${chainHeight}. Try something in a lower range.`);
	}
	else {
		try {
			let value = await chain.getBlock(height);
			res.send(value);
		}
		catch (error) {
			console.log('We got an error back.')
			res.send('An error occured when querying the block data.')
		}
	}
})


app.post('/block/adding/', async (req, res) => {
  if (req.body._data === '' || req.body._data === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Fill the body parameter"
    })
  }
  else {
  	  let success = await chain.addBlock(new Block(req.body._data))
	  if(success) {
		res.send(success)
	  }
	  else {
	  	res.send('We were not able to add the block before requesting the return...')
	  }
  }
})

