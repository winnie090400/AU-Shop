const conn = require("../mysql.js");
const crypto = require('crypto');

module.exports={
	create:function(email,name,pass){
		return new Promise(function(resolve, reject){
			conn.query('select email from user where email = ? and provider = "native"', email , function (err, results, fields) {
	    		if(err){
						console.log(err);
						return;
				}
				
				//email not been used , create user data and token 	    
	    		if (!results.length){
	    		
		    	const hash = crypto.createHash('sha256');
		    	hash.update(crypto.randomBytes(48));
		    	
		        let userInsert = {
		            provider:"native",
		            name:name,
		            email:email,
		            password:pass,
		            token:hash.digest('hex'),
		            token_expired:Date.now()+ 1800000,  //token半小時過期
		            picture:"temp.jpg",

		        }

		        //Add user info into DB and send user data back
		        conn.query('insert into user set ?',userInsert,function (err, results, fields) {
		            if(err){
						console.log(err);
						return;
					}

					conn.query('select * from user where email = ?',email,function (err, results, fields) {
			            let user = {};
			            user.id = results[0].id;
			            user.provider = results[0].provider;
			            user.name = results[0].name;
			            user.email = results[0].email;
			            user.picture = results[0].picture;

			            let data = {};
			            data.access_token = results[0].token;
			            data.access_expired = results[0].token_expired;
			            
			            data.user = user;

			            resolve({data:data});
		 			});


	        	});
	        
            
			    }else{
			    	//duplicate email address
	                resolve({error:"Invalid token."});
			    }
	    	});   
			
		});
	},
	native:function(email,pass,provider){

		return new Promise(function(resolve, reject){
		
		conn.query('select id from user where email = ? and password = ? and provider = "native"', [email,pass] , function (err,results) {

	    if (!results.length){
	        
            resolve({ error: "user info not founded" });
            
	    }else{
	    	
	    	let hash = crypto.createHash('sha256');
	    	hash.update(crypto.randomBytes(48));
	        let token = hash.digest('hex');
	        let token_expired = Date.now()+ 1800000;  //半小時過期
	        let id = results[0].id;
	
	        conn.query('UPDATE user SET token = ?, token_expired = ? WHERE id = ?',[token,token_expired,id], function (err,results) {
	            if(err){
					console.log(err);
					return;
				}
	            console.log('Rows affected:', results.affectedRows);

	            conn.query('SELECT * FROM user WHERE id = ?', id ,function (err,results) {
		            let user = {};
		            user.id = results[0].id;
		            user.provider = results[0].provider;
		            user.name = results[0].name;
		            user.email = results[0].email;
		            user.picture = results[0].picture;

		            let data = {};
		            data.access_token = results[0].token;
		            data.access_expired = results[0].token_expired;
		            
		            data.user = user;

		            let signin_response = {data:data};

		            resolve(signin_response);
	 			});

	        });
	    	
	    	
	    }
    }); 
			
		});
	},
	FB:function(name,email){

		conn.query('SELECT id FROM user WHERE name = ? AND email = ? AND provider = "facebook"', [name,email] , function (err,results) {
    		
    		if(!results.length){
		    	const hash = crypto.createHash('sha256');
		    	hash.update(crypto.randomBytes(48));
		        let userInsert = {
		            provider:"facebook",
		            name:name,
		            email:email,
		            password:0,
		            token:hash.digest('hex'),
		            token_expired:Date.now()+ 1800000,  //半小時過期
		            picture:"temp.jpg",

		        }

		        conn.query('INSERT INTO user SET ?',userInsert,function (err,results) {
		            if(err){
						console.log(err);
						return;
					}
		            console.log('Add fb user info into DB');
		        });
		    	
		    }else{

	    		let hash = crypto.createHash('sha256');
		    	hash.update(crypto.randomBytes(48));
		        let token = hash.digest('hex');
		        let token_expired = Date.now()+ 1800000;  //半小時過期
		        let id = results[0].id;
		
		        conn.query('UPDATE user SET token = ?, token_expired = ? WHERE id = ?',[token,token_expired,id], function (err,results) {
		            if(err){
						console.log(err);
						return;
					}
		            console.log('Rows affected:', results.affectedRows);
			        
			        conn.query('SELECT * FROM user WHERE id = ?', id ,function (err,results) {
			            let user = {};
			            user.id = results[0].id;
			            user.provider = results[0].provider;
			            user.name = results[0].name;
			            user.email = results[0].email;
			            user.picture = results[0].picture;

			            let data = {};
			            data.access_token = results[0].token;
			            data.access_expired = results[0].token_expired;
			            
			            data.user = user;

			            let fbsignin_response = {data:data};
			            resolve(fbsignin_response);
		 			});

		        });
			        
		    }

	    });
	},
	check:function(accessToken){
		return new Promise(function(resolve, reject){
			conn.query("select * from user where token = ?", [accessToken], function(error, results, fields){
			if(error){
				res.send({error:"Database Query Error"});
			}else{
				if(results.length===0){
					resolve({error:"Invalid Access Token"});
				}else{
					let user_id = results[0].id
					resolve(user_id);
				}
			}

			});

		});
	}
	
};

