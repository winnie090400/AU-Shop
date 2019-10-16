const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

module.exports={

	set:function(key,value){
		myCache.set( key, value, function(err, success){
            if(err){
                console.log(err);
                return;
               
            }else if(success){
            	console.log("set cache status "+ success);
 
            }

    	});
	},
	get:function(key){
		let data = myCache.get( key, function( err, value ){
		  if( !err ){
		    if(value === undefined){
		    	return undefined;
		    }else{
		    	return value;
		    }
		  }
		});
		return data;
	},
	getKeys:function(){
		let data =  myCache.keys( function( err, mykeys ){
		  if(!err){
		  	return mykeys;
		  }
		});
		return data;
	},
	del:function(key){
		myCache.del(key, function( err, count ){
		  if(!err){
		    console.log('the number of deleted entries: '+ count ); 
		    
		  }
		});
	},
	flushAll:function(){
		myCache.flushAll();
	}

};
