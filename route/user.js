const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const router = express.Router();
const dao={
	user:require("../dao/user.js")
};

router.post('/signup', function(req, res) {
  
  const email = req.body.email;
  const name = req.body.name;
  const pass = req.body.pass;

  if(!email||!name||!pass){
	res.send({error:"Wrong Request"});
	return;
  }
  dao.user.create(email,name,pass).then(function(data){
		res.send(data);
	}).catch(function(error){
		res.send({error:error});
	});
});



router.post('/signin', function(req, res) {

	let email = req.body.email;
	let pass = req.body.pass;
	let provider = req.body.provider;

	if(!email||!pass){
		res.send({error:"Wrong Request"});
		return;
	}

	if(provider == "native"){

		dao.user.native(email,pass,provider).then(function(data){
			res.send(data);
		}).catch(function(error){
			res.send({error:error});
		});

    }else if(provider == "facebook"){
    	let fbToken = req.body.token;
    	//從header request取得fb token
    	request('https://graph.facebook.com/v3.3/me?&fields=name,email&access_token=' + fbToken, (error, resp, body) => {
    	    
    		let fbbody = JSON.parse(body);
    		let name = fbbody.name;
    		let email = fbbody.email;

	    	//判斷email 在DB內有沒有資料

	    	dao.user.FB(name,email).then(function(data){
			res.send(data);
			}).catch(function(error){
				res.send({error:error});
			});
	    	

		});
  
    }   

});

// router.get('/profile', function(request, response) {
  	
// 	//get bearer token
// 	let header = request.header("authorization").split(" ");
// 	let authorization = header[1];

//   	//抓出db的token_expired time
//   	conn.query('select * from user where token = ?',authorization,function (err,result) {
//   		let token_expired = result[0].token_expired;
// 		//確認 expired or not
// 		  	if(token_expired - Date.now() <= 0){
// 				//token過期 > redirect to singn in page
// 				// response.redirect('/signin.html');
// 				response.send({error:"Invalid token."});

// 		  	}else{
// 				//token有效 > send profile data
// 				let userProfile = {};
// 				let data = {};
// 	            data.id = result[0].id;
// 	            data.provider = result[0].provider;
// 	            data.name = result[0].name;
// 	            data.email = result[0].email;
// 	            data.picture = result[0].picture;
// 	            userProfile.data = data;
// 				response.send(userProfile);
// 		  	}

// 	});

// });

module.exports = router;