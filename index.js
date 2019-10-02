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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use('/user', usersRouter);


app.get("/api/1.0/products/details",function(req, res){

	let productId=req.query.id;
	let store=req.query.store;

	dao.product.get(productId,store).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});

});

app.get("/api/1.0/all",function(req, res){
	
	let size=9;

	dao.product.forIndex(size).then(function(data){
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

	let filter=req.query.filter;

	if(!filter){
		filter=null;
	}
	
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
			listProducts({store:'co'},filter, size, accessToken, paging, listCallback);
			break;

		case "priceline":
			listProducts({store:'p'},filter, size, accessToken, paging, listCallback);
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

//顯示使用者所有的追蹤清單
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

app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});