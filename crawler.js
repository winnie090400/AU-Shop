//get vitamin product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))
// for(let i=1; i<77; i++){
	
// 	request({
// 	    url: `https://www1.chemistwarehouse.com.au/shop-online/81/vitamins?page=${i}`,
// 	    method: "GET"
// 	  }, function(error, res, body) {
// 	    if (error) {
// 	      console.log(error);	
// 	      return;
// 	    }else{
// 	    	dao.product.insertChemist(body).then(console.log('ok!'));
// 	  }
// 	});
// }

//get beauty product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))
// for(let i=1; i<291; i++){

// 	request({
// 	    url: `https://www.chemistwarehouse.com.au/Shop-Online/257/Beauty?page=${i}`,
// 	    method: "GET"
// 	  }, function(error, res, body) {
// 	    if (error) {
// 	      console.log(error);	
// 	      return;
// 	    }else{
// 	    	dao.product.insertChemist(body).then(console.log('ok!'));

// 	  }
// 	});
// }

// 105 page woolworths.com.au
// for(let i=1; i<106; i++){

// 	request({
//     	url: 'https://www.woolworths.com.au/apis/ui/browse/category',
//     	method: "POST",
// 	    json:{
// 	    	"categoryId":"1_894D0A8",
// 	    	"pageNumber":`${i}`,
// 	    	"pageSize":24,
// 	    	"sortType":"TraderRelevance",
// 	    	"url":`/shop/browse/health-beauty?pageNumber=${i}`,
// 	    	"location":"/shop/browse/health-beauty",
// 	    	"formatObject":"{\"name\":\"Health & Beauty\"}",
// 	    	"isSpecial":false,"isBundle":false,
// 	    	"isMobile":true,
// 	    	"filters":null
//     	}
//   	}, function(error, response, body) {
// 	    if (error) {
// 	      console.log(error);	
// 	      return;
// 	    }else{
// 	    	dao.product.insertWws(body).then(console.log('ok!'));
// 	    }
// 	});
// }

// Big W 
// let elements = [
// 	{c:'bath-body/c/6221/',p:10},
// 	{c:'dental-care/c/6210/',p:7},
// 	{c:'deodorant/c/6225/',p:6},
// 	{c:'fragrances/c/6211/',p:1},
// 	{c:'hair-care/c/6213/',p:41},
// 	{c:'health-care/c/6226/',p:12},
// 	{c:'makeup-cosmetics/c/6220/',p:61},
// 	{c:'shaving-grooming/c/6224/',p:9},
// 	{c:'skincare/c/6218/',p:30}
// ];

// for(let element of elements){

// 	for(let i=0; i<element.p; i++){
// 		request({
// 		    url: `https://www.bigw.com.au/beauty-health/${element.c}?q=%3Arelevance&page=${i}`,
// 		    method: "GET"
// 		  }, function(error, response, body) {
// 		    if (error) {
// 		      console.log(error);	
// 		      return;
// 		    }else{
// 		      dao.product.insertBigw(body,element).then(console.log('ok!'));
// 	    }
// 	  });
// 	}
// }