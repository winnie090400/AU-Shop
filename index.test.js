const cheerio = require('cheerio');
const request = require("request");
const dao = {
	product:require("./dao/product.js"),
	user:require("./dao/user.js")
};
const user = require("./route/user.js");
const supertest = require('supertest');

// wishlist RESTful APIs test
test('wishlist add test', () => {
  return dao.product.wishlist('10103','bigw','3d42ef457876b74874be115c228db6fc51f71708e897f0093669b18a2d0d1642').then(data => {
    expect(data).toEqual({data:'add'});
  });

});

test('wishlist delete test', () => {
  return dao.product.wishlist('10103','bigw','3d42ef457876b74874be115c228db6fc51f71708e897f0093669b18a2d0d1642').then(data => {
    expect(data).toEqual({data:'delete'});
  });
});

test('wishlist error handler test', () => {
  return dao.product.wishlist('10103','bigw','123456789').catch(error => {
    expect(error).toEqual({error:"Invalid Access Token"});
  });
});


// crawler test
test('if request to chemistwarehouse website, connected and get product successful', () => {
  request({
	url: `https://www1.chemistwarehouse.com.au/shop-online/81/vitamins?page=1`,
	method: "GET",
	}, function(error, res, body) {
	if (error) {
		console.log(error);	
		return;
	}else{
		let statusCode = res.statusCode;	
		let $ = cheerio.load(body);
		let link = $('.product-container').attr('href');
		let price = $('.product-container').find('.Price').text().replace(/\s\s+/g, '').replace('$', '');
		let discount = $('.product-container').find('.Price').next().text().replace(/\s\s+/g, '').replace(' Off RRP!','').replace('$', '');
		let none = $('.product-container').find('.Price').next().attr('style');
		let id = link.split("/")[2];

		if(!discount || none == 'display:none'){
			discount ='0';
			expect(discount).toBe('0');

		}else{
			discount = discount;
			expect(discount).not.toBeNull();
		}
		
		let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;		
		let title = $('.product-container').attr('title').replace(' ', '');
		let subTitle = link.split("/")[3].split("?")[0];

		expect(link).not.toBeNull();
		expect(price).not.toBeNull();
		expect(originPrice).not.toBeNull();
		expect(title).not.toBeNull();
		expect(subTitle).not.toBeNull();
		expect(id).not.toBeNull();
	  }
	});
});


test('if request to woolworths website, connected and get product successful', () => {
    request({
    	url: 'https://www.woolworths.com.au/apis/ui/browse/category',
    	method: "POST",
	    json:{
	    	"categoryId":"1_894D0A8",
	    	"pageNumber":`1`,
	    	"pageSize":24,
	    	"sortType":"TraderRelevance",
	    	"url":`/shop/browse/health-beauty?pageNumber=1`,
	    	"location":"/shop/browse/health-beauty",
	    	"formatObject":"{\"name\":\"Health & Beauty\"}",
	    	"isSpecial":false,"isBundle":false,
	    	"isMobile":true,
	    	"filters":null
    	}
  	}, function(error, res, body) {
	if (error) {
		console.log(error);	
		return;
	}else{
		let statusCode = res.statusCode;
		let id = body.Bundles[0].Products[0].Stockcode;
		let category = body.Bundles[0].Products[0].AdditionalAttributes.sapsubcategoryname;
		let link = 'https://www.woolworths.com.au/shop/productdetails/'+ id + '/' + body.Bundles[0].Products[0].UrlFriendlyName;
		let subTitle = body.Bundles[0].Products[0].UrlFriendlyName + '-' + body.Bundles[0].Products[0].PackageSize;
		let title = body.Bundles[0].Name;
		let originPrice = body.Bundles[0].Products[0].WasPrice;
		let barcode = body.Bundles[0].Products[0].Barcode;
		let store = 'woolworths';
		let img = body.Bundles[0].Products[0].MediumImageFile;
		let price = body.Bundles[0].Products[0].Price;

		if(price == null){
			price = '0';
			originPrice = '0'
			expect(price).toBe('0');
			expect(originPrice).toBe('0');
		}else{
			price = price;
			originPrice = originPrice;
			expect(price).not.toBeNull();
			expect(originPrice).not.toBeNull();
		}

		let discount = originPrice - price;
		
		expect(id).not.toBeNull();
		expect(category).not.toBeNull();
		expect(link).not.toBeNull();
		expect(subTitle).not.toBeNull();
		expect(title).not.toBeNull();
		expect(barcode).not.toBeNull();
		expect(img).not.toBeNull();
		expect(discount).not.toBeNull();
	  }
	});
});


test('if request to bigw website, connected and get product successful', () => {
    request({
	    url: `https://www.bigw.com.au/beauty-health/bath-body/c/6221/?q=%3Arelevance&page=1`,
	    method: "GET",
	    headers:{
	    	'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Mobile Safari/537.36'
	    }
	}, function(error, res, body) {
	if (error) {
		console.log(error);	
		return;
	}else{
		let statusCode = res.statusCode;
		let $ = cheerio.load(body);
		let link = $('.productSlot').find('a').attr('href');

		if(link.substr(0,1) == 'h'){
    		link = link;
    	}else{
    		link = 'https://www.bigw.com.au' + link;
    	}

		let title = $('.productSlot').find('a').attr('title');
		let id = $('.productSlot').find('a').attr('data-product-code');
		let price = parseFloat($('.productSlot').find('.online-price.padding-right-zero').text().replace(/\s\s+/g, '.').replace('.$.', '').slice(0, -1));
    	let img = 'https://www.bigw.com.au' + $('.productSlot').find('.image a').html().replace(/\s\s+/g, '').split(" ")[3].split('"')[1];
    	let discount = $('.productSlot').find('.subText.save').text().replace(/\s\s+/g, '').replace('save $','');
    	
    	if(!discount){
    		discount = 0;
    		expect(discount).toBe('0');
    	}else{
    		discount = parseFloat(discount);
    		expect(discount).not.toBeNull();
    	}
    	
    	let subTitle = link.split("/")[4];
    	let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;

		expect(id).not.toBeNull();
		expect(link).not.toBeNull();
		expect(subTitle).not.toBeNull();
		expect(title).not.toBeNull();
		expect(img).not.toBeNull();
		expect(price).not.toBeNull();
		expect(originPrice).not.toBeNull();
	  }
	});
});

describe('test user signup', function() {
  test('test1', () => {
    request({
    	url: 'https://kelolooo.con/user/signup',
    	method: "POST",
	    
  	}, function(error, res, body) {
		if (!error) {
			expect(body).toEqual({error:"Wrong Request"});
		}
	});
  });

  test('test2', () => {
    request({
    	url: 'https://kelolooo.con/user/signup',
    	method: "POST",
	    json:{
	    	"name":"",
	    	"email":"",
	    	"pass":""
    	}
  	}, function(error, res, body) {
		if (!error) {
			expect(body).toEqual({error:"Wrong Request"});
		}
	});
  });

  test('test3', () => {
    request({
    	url: 'https://kelolooo.con/user/signup',
    	method: "POST",
	    json:{
	    	"name":"winnie",
	    	"email":"123@123.com"
    	}
  	}, function(error, res, body) {
		if (!error) {
			expect(body).toEqual({error:"Wrong Request"});
		}
	});
  });

  test('test4', () => {
    request({
    	url: 'https://kelolooo.con/user/signup',
    	method: "POST",
	    json:{
	    	"name":"111",
	    	"email":"111@111.com",
	    	"pass":"111"
    	}
  	}, function(error, res, body) {
		if (!error) {
			expect(body).toEqual({error:"Wrong Request"});
		}
	});
  });

});