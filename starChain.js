const chainExport = require('./blockchain.js');
const Blockchain = chainExport.blockchain;
const Block = chainExport.block;
const chain = new Blockchain();

const level = require('level');
const starDB = './starDB';
const dbS = level(starDB, {valueEncoding: 'json'})

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const bitcoinMessage = require('bitcoinjs-message')

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


// ============ Star Project Starts Here ==========

app.post('/requestValidation/', (req, res) => {
  if (req.body._address === '' || req.body._address === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Fill the body parameter with your wallet address."
    })
  }
  else {
  	  const address = req.body._address;
  	  const requestTimeStamp = new Date().getTime().toString().slice(0,-3);
  	  const validationWindowInMin = 10;
  	  const message = `${address}:${requestTimeStamp}:starRegistry`;
  	  const validationData = {
  	  	address,
  	  	message,
  	  	requestTimeStamp,
  	  	validationWindowInMin
  	  }
  	  dbS.put(address, validationData, function(err) {
  	  	if(err) {
  	  		console.log(`We were unable to create a requestBlock for the address ${address} because we experienced a PUT error.`)
  	  	}
  	  	else {
  	  		res.send(validationData);
  	  	}
  	  })
  	}
});

app.post('/message-signature/validate/', async (req, res) => {
  if (req.body._address === '' || req.body._address === undefined || req.body._signature === '' || req.body._signature === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Fill the body parameter with your wallet address and message signature."
    })
  }
  else {
  	    let address = req.body._address;
  	    let signature = req.body._signature;
  	    let starRequestValue = await starRequest(address);
  	    let timeNow = new Date().getTime().toString().slice(0,-3);
  	    let timeRequest = starRequestValue.requestTimeStamp;
  	    let validWindow = starRequestValue.validationWindowInMin;
  	    let timeDif = timeNow - (timeRequest + (validWindow * 60));
  	    if(timeDif > 0) {
  	  		res.send('Unforunately, the time period in which you were able to verify you address has passed. You can start a new request if you please.')
  	    }
  	    else {
  	  		if(!bitcoinMessage.verify(starRequestValue.message, address, signature)) {
  	  			res.send('Unforunately, it seems that the signature and adress combination is not able to validate the message.')
  	  		}
  	  		
  	  		else {
  	  			// Add star to the blockchain
  	  			res.send('Great! You star request is confirmed and it is incorporated in the blockchain.');
  	  		}
  	    }
  	}
});


const starRequest = (address) => {
	return new Promise( async (resolve, reject) => {
		await dbS.get(address, function(err, value) {
			if(err) {
				console.log('Woops. Have an error requesting the data.')
				reject(err);
			}
			else {
			  	resolve(value);
			}
		});
	})
}

