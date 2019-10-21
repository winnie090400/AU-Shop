const express = require('express');
const bodyParser = require('body-parser');
const dao={
	product:require("../dao/product.js"),
	user:require("../dao/user.js")
};
const router = express.Router();
const myCache = require('../cache.js');

router.get("/products/details",function(req, res){

	let productId=req.query.id;
	let store=req.query.store;

	dao.product.get(productId,store).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});

});

router.get("/all",function(req, res){

	if(myCache.get("index_cache") === undefined){
		
		let size=9;

		dao.product.forIndex(size).then(function(data){
			myCache.set("index_cache",data);
			res.send(data);
		}).catch(function(error){
			res.send({error:error});
		});
		
	}else{
		console.log('index data from cache')
		res.send(myCache.get("index_cache"));
		
	}

});

router.get("/search",function(req, res){

	let size=24;
	let keyword;

	if(req.query.keyword){

		keyword = req.query.keyword;

	}else{

		res.send({error:"Wrong Request"});
	}

	dao.product.search(size, keyword).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});

});

router.get("/products/:category", function(req, res){

	let paging=parseInt(req.query.paging);

	if(!Number.isInteger(paging)){
		paging=0;
	}

	let filter=req.query.filter;

	if(!filter){
		filter=null;
	}

	let size = 24;
	let category = req.params.category;
	let result = {error:"Wrong Request"};

	let listCallback=function(data){
		res.send(data);
	};
	
	switch(category){

		case "woolworths":
			listProducts({store:'w'},filter, size, paging, listCallback);
			break;
			
		case "chemistwarehouse":
			listProducts({store:'c'},filter, size, paging, listCallback);
			break;

		case "bigw":
			listProducts({store:'b'},filter, size, paging, listCallback);
			break;

		case "coles":
			listProducts({store:'co'},filter, size, paging, listCallback);
			break;

		case "priceline":
			listProducts({store:'p'},filter, size, paging, listCallback);
			break;
	
		default:
			res.send({error:"Wrong Request"});
	}
});
	
	function listProducts(category, filters, size, paging,callback){

		dao.product.list(category, filters, size, paging).then(function(body){
			callback(body);
		}).catch(function(error){
			callback({error:error});
		});	

	}

//使用者增加或刪除願望清單
router.post("/wishlist", function(req, res){

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
router.post("/user/wishlist", function(req, res){
	
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
router.post("/tracklist", function(req, res){
	
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
router.post("/user/tracklist", function(req, res){
	
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

module.exports = router;