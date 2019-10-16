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

	if(provider == "native"){

		dao.user.native(email,pass,provider).then(function(data){
			res.send(data);
		}).catch(function(error){
			res.send({error:error});
		});

    }else if(provider == "facebook"){
    	let fbToken = req.body.token;

    	request('https://graph.facebook.com/v3.3/me?&fields=name,email&access_token=' + fbToken, (error, resp, body) => {
    	    
    		let fbbody = JSON.parse(body);
    		let name = fbbody.name;
    		let email = fbbody.email;

	    	dao.user.FB(name,email).then(function(data){
				res.send(data);
			}).catch(function(error){
				res.send({error:error});
			});
		});
    }   
});

module.exports = router;