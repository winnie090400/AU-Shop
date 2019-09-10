const express = require('express');
const bodyParser = require('body-parser');
const dao={
	product:require("./dao/product.js"),
	user:require("./dao/user.js")
};
const request = require("request");
const app = express();

const usersRouter = require('./route/user');
// const adminRouter = require('./route/admin');
// const apiRouter = require('./route/api');

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
// app.use('/admin', adminRouter);
// app.use('/api/1.0', apiRouter);


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

app.get("/api/1.0/products/all", function(req, res){
// 	let paging=parseInt(req.query.paging);
// 	if(!Number.isInteger(paging)){
// 		paging=0;
// 	}
// 	let size=9;
// 	let category=req.params.category;
// 	let result={error:"Wrong Request"};
// 	let listCallback=function(data){
// 		res.send(data);
// 	};
// 	switch(category){

// 		case "all":
// 			listProducts(null, size, paging, listCallback);
// 			break;
// 		case "men": case "women": case "accessories":
// 			listProducts({
// 				category:category
// 			}, size, paging, listCallback);
// 			break;
// 		case "search":
// 			if(req.query.keyword){
// 				listProducts({
// 					keyword:req.query.keyword
// 				}, size, paging, listCallback);
// 			}else{
// 				res.send({error:"Wrong Request"});
// 			}
// 			break;
// 		default:
// 			res.send({error:"Wrong Request"});
// 	}
// });
// 	function listProducts(filters, size, paging, callback){
// 		dao.product.list(filters, size, paging).then(function(body){
// 			callback(body);
// 		}).catch(function(error){
// 			callback({error:error});
// 		});		
// 	}

	// let paging=parseInt(req.query.paging);
	// if(!Number.isInteger(paging)){
	// 	paging=0;
	// }
	let accessToken=req.get("Authorization");
	// let user_id=req.get("user_id");
	if(accessToken === undefined){
		accessToken=null;
	}else{
		accessToken=req.get("Authorization").replace("Bearer ", "");
	}

	let size=9;
	let category='all';
	let result={error:"Wrong Request"};
	let listCallback=function(data){
		res.send(data);
	};
	switch(category){

		case "all":
			listProducts(null, size, accessToken,listCallback);
			// listProducts(null, size, user_id,listCallback);
			break;
	// 	case "men": case "women": case "accessories":
	// 		listProducts({
	// 			category:category
	// 		}, size, paging, listCallback);
	// 		break;
	// 	case "search":
	// 		if(req.query.keyword){
	// 			listProducts({
	// 				keyword:req.query.keyword
	// 			}, size, paging, listCallback);
	// 		}else{
	// 			res.send({error:"Wrong Request"});
	// 		}
	// 		break;
	// 	default:
	// 		res.send({error:"Wrong Request"});
	}
});
	function listProducts(filters, size, accessToken,callback){
		dao.product.list(filters, size, accessToken).then(function(body){
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

app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});