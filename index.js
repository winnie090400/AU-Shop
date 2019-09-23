const express = require('express');
const bodyParser = require('body-parser');
const dao={
	product:require("./dao/product.js"),
	user:require("./dao/user.js")
};
const CronJob = require('cron').CronJob;
const crawler = require('./crawler.js');
const app = express();

const usersRouter = require('./route/user');

app.use("/api/", function(req, res, next){
	//console.log(req.originalUrl);
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
	res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.set("Access-Control-Allow-Credentials", "true");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static(__dirname + '/public'));


app.use('/user', usersRouter);


app.get("/api/1.0/products/details",function(req, res){
	let productId=parseInt(req.query.id);
	let store=req.query.store;
	if(!Number.isInteger(productId)){
		res.send({error:"Wrong Request"});
		return;
	}
	dao.product.get(productId,store).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});
});

app.get("/api/1.0/all",function(req, res){
	let accessToken=req.get("Authorization");
	if(accessToken === undefined){
		accessToken=null;
	}else{
		accessToken=req.get("Authorization").replace("Bearer ", "");
	}
	let size=9;
	dao.product.forIndex(size, accessToken).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});		
});

app.get("/api/1.0/search",function(req, res){
	let accessToken=req.get("Authorization");
	if(accessToken === undefined){
		accessToken=null;
	}else{
		accessToken=req.get("Authorization").replace("Bearer ", "");
	}
	let size=24;

	let keyword;
	if(req.query.keyword){
		keyword = req.query.keyword;
		console.log(keyword)
	}else{
		res.send({error:"Wrong Request"});
	}

	dao.product.search(size, accessToken, keyword).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});		
});

app.get("/api/1.0/products/:category", function(req, res){

	let paging=parseInt(req.query.paging);
	if(!Number.isInteger(paging)){
		paging=0;
	}
	// console.log(paging)
	let filter=req.query.filter;
	if(!filter){
		filter=null;
	}
	console.log(filter)
	// console.log('index   '+filter)
	let accessToken=req.get("Authorization");
	if(accessToken === undefined){
		accessToken=null;
	}else{
		accessToken=req.get("Authorization").replace("Bearer ", "");
	}

	let size = 24;
	let category = req.params.category;
	let result = {error:"Wrong Request"};
	let listCallback=function(data){
		res.send(data);
	};
	
	switch(category){

		case "woolworths":
			listProducts({store:'w'},filter, size, accessToken, paging, listCallback);
			break;
			
		case "chemistwarehouse":
			listProducts({store:'c'},filter, size, accessToken, paging, listCallback);
			break;
		case "bigw":
			listProducts({store:'b'},filter, size, accessToken, paging, listCallback);
			
			break;
		case "coles":
			istProducts({store:'co'},filter, size, accessToken, paging, listCallback);
			
			break;
		case "priceline":
			listroducts({store:'p'},filter, size, accessToken, paging, listCallback);
			
			break;
	
		default:
			res.send({error:"Wrong Request"});
	}
});
	function listProducts(category, filters, size, accessToken, paging,callback){
		dao.product.list(category, filters, size, accessToken, paging).then(function(body){
			callback(body);
		}).catch(function(error){
			callback({error:error});
		});		
	}


// app.get("/api/1.0/products/:category", function(req, res){

// 	let paging=parseInt(req.query.paging);
// 	if(!Number.isInteger(paging)){
// 		paging=0;
// 	}

// 	let accessToken=req.get("Authorization");
// 	if(accessToken === undefined){
// 		accessToken=null;
// 	}else{
// 		accessToken=req.get("Authorization").replace("Bearer ", "");
// 	}

// 	let size = 24;
// 	let category = req.params.category;
// 	let result = {error:"Wrong Request"};
// 	let listCallback=function(data){
// 		res.send(data);
// 	};
	
// 	switch(category){

// 		case "woolworths":
// 			if(req.query.filter){
// 				listProducts({store:'w'},{filter:req.query.filter}, size, accessToken, paging, listCallback);
// 			}else{
// 				listProducts({store:'w'}, null, size, accessToken, paging, listCallback);
// 			}
// 			break;
			
// 		case "chemistwarehouse":
// 			if(req.query.filter){
// 				listProducts({store:'c'},{filter:req.query.filter}, size, accessToken, paging, listCallback);
// 			}else{
// 				listProducts({store:'c'}, null, size, accessToken, paging, listCallback);
// 			}
// 			break;
// 		case "bigw":
// 			if(req.query.filter){
// 				listProducts({store:'b'},{filter:req.query.filter}, size, accessToken, paging, listCallback);
// 			}else{
// 				listProducts({store:'b'}, null, size, accessToken, paging, listCallback);
// 			}
// 			break;
// 		case "coles":
// 			if(req.query.filter){
// 				listProducts({store:'co'},{filter:req.query.filter}, size, accessToken, paging, listCallback);
// 			}else{
// 				listProducts({store:'co'}, null, size, accessToken, paging, listCallback);
// 			}
// 			break;
// 		case "priceline":
// 			if(req.query.filter){
// 				listProducts({store:'p'},{filter:req.query.filter}, size, accessToken, paging, listCallback);
// 			}else{
// 				listProducts({store:'p'}, null, size, accessToken, paging, listCallback);
// 			}
// 			break;
	
// 		default:
// 			res.send({error:"Wrong Request"});
// 	}
// });
// 	function listProducts(category, filters, size, accessToken, paging,callback){
// 		dao.product.list(category, filters, size, accessToken, paging).then(function(body){
// 			callback(body);
// 		}).catch(function(error){
// 			callback({error:error});
// 		});		
// 	}


//使用者增加或刪除願望清單
app.post("/api/1.0/wishlist", function(req, res){
	let product_id=req.body.product_id;
	let store=req.body.store;
	let accessToken=req.get("Authorization");
	if(accessToken){
		accessToken=accessToken.replace("Bearer ", "");
	}else{
		res.send({error:"authorization is required."});
		return;
	}	
	dao.product.wishlist(product_id,store,accessToken).then(function(body){
			res.send(body);
		}).catch(function(error){
			res.send(error);
		});		
	
});

//使用者所有的願望清單
app.post("/api/1.0/user/wishlist", function(req, res){
	
	let accessToken=req.get("Authorization");

	if(accessToken){
		accessToken=accessToken.replace("Bearer ", "");
	}else{
		res.send({error:"Wrong Request: authorization is required."});
		return;
	}

	dao.user.check(accessToken).then(function(body){
		let user_id = body;
		dao.product.showWishlist(user_id).then(function(body){
			res.send(body);

		}).catch(function(error){
		res.send(error);
		console.log(error)
		});
	}).catch(function(error){
		res.send(error);
	});		

});


//使用者增加或刪除追蹤清單
app.post("/api/1.0/tracklist", function(req, res){
	let product_id=req.body.product_id;
	let store=req.body.store;
	let price=req.body.price;
	let accessToken=req.get("Authorization");
	if(accessToken){
		accessToken=accessToken.replace("Bearer ", "");
	}else{
		res.send({error:"authorization is required."});
		return;
	}

	dao.user.check(accessToken).then(function(body){
		let user_id = body;
		dao.product.tracklist(product_id,store,user_id,price).then(function(body){
			res.send(body);
		}).catch(function(error){
			res.send(error);
		});		
	}).catch(function(error){
		res.send(error);
	});		
	
	
});

//使用者所有的追蹤清單
app.post("/api/1.0/user/tracklist", function(req, res){
	
	let accessToken=req.get("Authorization");

	if(accessToken){
		accessToken=accessToken.replace("Bearer ", "");
	}else{
		res.send({error:"Wrong Request: authorization is required."});
		return;
	}

	dao.user.check(accessToken).then(function(body){
		let user_id = body;
		dao.product.showTracklist(user_id).then(function(body){
			res.send(body);

		}).catch(function(error){
		res.send(error);
		console.log(error)
		});
	}).catch(function(error){
		res.send(error);
	});		

});



// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Calendar API.
//   authorize(JSON.parse(content), listEvents);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// *
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
 
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// /**
//  * Lists the next 10 events on the user's primary calendar.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listEvents(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   calendar.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming 10 events:');
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   });
// }


app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});