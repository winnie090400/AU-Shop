const pptrFirefox = require('puppeteer-firefox');
const cheerio = require('cheerio');
const request = require("request");
const nodemailer = require('nodemailer');
const dao={
	product:require("./dao/product.js"),
	user:require("./dao/user.js")
};
const CronJob = require('cron').CronJob;
const credentials = require('./credentials.js');
const myCache = require('./cache.js');

// coles 爬蟲
new CronJob('0 14 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'cosmetics',p:3})
	
}, null, true, 'Australia/Sydney');


new CronJob('0 15 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'dental',p:6})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 17 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'first-aid',p:3})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 18 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'hair-accessories',p:2})
	
}, null, true, 'Australia/Sydney');

new CronJob('30 18 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'hair-care',p:9})
	
}, null, true, 'Australia/Sydney');

new CronJob('30 21 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'hair-removal',p:4})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 23 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'medicinal',p:13})
	
}, null, true, 'Australia/Sydney');

new CronJob('30 27 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'personal-care-hygiene',p:11})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 31 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'shower-bath-care',p:7})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 33 2 * * 3', function() {
	
	crawler_coles({m:'health-beauty',c:'skin-care',p:8})
	
}, null, true, 'Australia/Sydney');

new CronJob('0 37 2 * * 3', function() {
	
	crawler_coles({m:'healthy-living',c:'diet-sports-nutrition',p:4})
	
}, null, true, 'Australia/Sydney');

function crawler_coles(element){
	for(let i=1; i<element.p; i++){

		setTimeout(async () => {
			
		  	const browser = await pptrFirefox.launch();
		  	const page = await browser.newPage();
		  	await page.goto(`https://shop.coles.com.au/a/a-vic-metro-richmond-south/everything/browse/${element.m}/${element.c}?pageNumber=${i}`);
		  	await page.waitForSelector('.product-image');
		  	let body = await page.content();
		  	dao.product.insertColes(body,element);
		  	myCache.flushAll();
		  	await browser.close();

		}, i*20000);
	}
}

async function crawler_priceline(url){

	const browser = await pptrFirefox.launch({headless:false});
	const page = await browser.newPage();
	await page.goto(url);
	await page.setViewport({
	    width: 1200,
	    height: 800
	});
	await page.waitForSelector('body');
	await page.click('#start-next-page');
	await autoScroll(page);
	await page.waitFor(5000);
	let body = await page.content();
	dao.product.insertPriceline(body);
	await browser.close();

};
  

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            },400);
        });
    });
}

// chemistwarehouse
new CronJob('0 55 10 * * 3', function() {
	let element = ['/81/vitamins','/542/fragrances','/665/skin-care','/648/cosmetics','/159/oral-hygiene-and-dental-care','/792/household','/129/hair-care','/1255/sports-nutrition'];
	for(let i=0; i<element.length; i++){
	  setTimeout(async () => {
	  let category = element[i];
	  request({
	    url: `https://www1.chemistwarehouse.com.au/shop-online${category}?`,
	    method: "GET",
	  }, function(error, res, body) {
	    if (error) {
	      console.log(error);	
	      return;
	    }else{
	    	let $ = cheerio.load(body);

			let item = $('.pager-count').text().replace('  Results ',"");

			let paging = parseInt(parseInt(item) / 24)+2;

			for(let i=1; i<paging; i++){
			request({
			    url: `https://www1.chemistwarehouse.com.au/shop-online${category}?page=${i}`,
			    method: "GET"
			  }, function(error, res, body) {
			    if (error) {
			      console.log(error);	
			      return;
			    }else{
			    	let cate = category.split('/')[2];
			    	dao.product.insertChemist(body,cate).then(console.log('ok!'));

			  }
			});
			}
		  }
		});
	  }, i*20000);
	}
}, null, true, 'Australia/Sydney');

// woolworths
new CronJob('0 07 18 * * 2',async function() {
	await dao.product.createTable('product_w_copy');

	for(let i=1; i<106; i++){
		await crawler_woolworths(i);
	}

	await dao.product.delete('product_w');
	await dao.product.dropTable('product_w_copy');

}, null, true, 'Australia/Sydney');

function crawler_woolworths(i){
	return new Promise( function(resolve, reject){
		request({
	    	url: 'https://www.woolworths.com.au/apis/ui/browse/category',
	    	method: "POST",
		    json:{
		    	"categoryId":"1_894D0A8",
		    	"pageNumber":`${i}`,
		    	"pageSize":24,
		    	"sortType":"TraderRelevance",
		    	"url":`/shop/browse/health-beauty?pageNumber=${i}`,
		    	"location":"/shop/browse/health-beauty",
		    	"formatObject":"{\"name\":\"Health & Beauty\"}",
		    	"isSpecial":false,"isBundle":false,
		    	"isMobile":true,
		    	"filters":null
	    	}
	  	}, function(error, response, body) {
		    if (error) {
		      console.log(error);	
		      return;
		    }else{
		    	dao.product.insertWws(body).then(console.log('data '+ i + ' ok!'));
		    	resolve();
		    }
		});
	});
}

// Big W
new CronJob('0 24 19 * * 2', async function() {

 	await dao.product.createTable('product_b_copy');

	let elements = [
		{c:'bath-body/c/6221/',p:10},
		{c:'dental-care/c/6210/',p:7},
		{c:'deodorant/c/6225/',p:7},
		{c:'fragrances/c/6211/',p:1},
		{c:'hair-care/c/6213/',p:42},
		{c:'health-care/c/6226/',p:12},
		{c:'makeup-cosmetics/c/6220/',p:63},
		{c:'shaving-grooming/c/6224/',p:9},
		{c:'skincare/c/6218/',p:32}
	];

	for(let element of elements){

		for(let i=0; i<element.p; i++){

			await crawler_bigw(element,i);

		}
	}

	await dao.product.delete('product_b');
	await dao.product.dropTable('product_b_copy');
	
}, null, true, 'Australia/Sydney');

function crawler_bigw(element,i){
	return new Promise( function(resolve, reject){
		request({
		    url: `https://www.bigw.com.au/beauty-health/${element.c}?q=%3Arelevance&page=${i}`,
		    method: "GET",
		    headers:{
		    	'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Mobile Safari/537.36'
		    }
		  }, function(error, response, body) {
		    if (error) {
		      console.log(error);	
		      return;
		    }else{
		      dao.product.insertBigw(body,element).then(console.log(element.c+i+'ok!'));
		      resolve();
		    }
    	});
	});
}

new CronJob('0 15 3 * * 3', function() {

	sendMail();

}, null, true, 'Australia/Sydney');

async function sendMail() {
  
	const mailTransport = nodemailer.createTransport( {
	    service: 'Gmail',
	    auth: {
	        user: credentials.gmail.user,
	        pass: credentials.gmail.pass
    	}
	});

	let mailList;
	await dao.user.getUserEmail().then(function(body){
			mailList = body.data;
		}).catch(function(error){
			return error;
		});
	
	for(let mail of mailList){

		let data;
		await dao.product.showTracklist(`${mail.id}`).then(function(body){
			
			data = body.data;
			
			if(data!='no results'){
				let content ="";
				for(let i=0; i<data.length; i++){
					if(data[i].discount != 0){
						content += `<a href='${data[i].link}'><img style="height:150px;width:150px;" src='${data[i].img}'></a><br>`+`<span>${data[i].title} at ${data[i].store} now is $${data[i].price}</span>`+	`<span style="color:red;"> save $${data[i].discount}</span><br><br>`;
					}
				};
				
				mailTransport.sendMail({
			    from: 'AU SHOP <aushop951753@gmail.com>',
			    to: `<${mail.email}>`,
			    subject: `Hi, ${mail.name} :)`,
			    html: 
			    `<h1>Your tacking list for this week:</h1>
			    <h3>${content}</h3>`
				
				}, function(err){
				    if(err){
				        console.log('Unable to send email: ' + err);
				    }
				});
			}
			
		}).catch(function(error){
			return error;
		});
	}
};
