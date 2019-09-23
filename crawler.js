
const conn = require("./mysql.js");
const pptrFirefox = require('puppeteer-firefox');
const cheerio = require('cheerio');
const request = require("request");
const dao={
	product:require("./dao/product.js"),
	user:require("./dao/user.js")
};
const CronJob = require('cron').CronJob;
const credentials = require('./credentials.js');
const nodemailer = require('nodemailer');



  let elements = [
		// {c:'cosmetics',p:111},
		// {c:'hair',p:106},
		// {c:'skincare',p:114},
		// {c:'fragrances',p:38},
		{c:'weight-and-vitamins',p:3},
		// {c:'diet-and-nutrition',p:10}
		// 32
	];

	// for(let element of elements){

	// 	let x = element.p;
	// 	function test(x) {
	// 	  if (x < 0) return;
	// 	  if (x === 0) return 1;
	// 	  return x * factorial(x - 1);
	// 	}
	// 	factorial(3);

	// 	// for(let i=0; i<element.p; i++){
			
				

	// 		function getProduct(){
	// 			request({
	// 		    url: `https://www.priceline.com.au/${element.c}/p/${i}`,
	// 		    method: "GET",
	// 		    headers: {
	// 	    		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0',
	// 	    		'X-NewRelic-ID':'VgUFUlZaGwoGVlRXAAY=',
	// 	    		'X-Requested-With':'XMLHttpRequest',
	// 	    		'Accept':'*/*',
	// 	    		'Accept-Encoding':'gzip, deflate, br',
	// 	    		'Accept-Language':'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3',
	// 	    		'Connection':'keep-alive',
	// 	    		'Cookie':'visid_incap_1902481=m+aUsvUDSJuIdfallDEVFUK6eF0AAAAAQUIPAAAAAADvtT6aNvupjqq616rZcsR2; optimizelyEndUserId=oeu1568193094755r0.6608170742231962; _gcl_au=1.1.753928025.1568193095; _ga=GA1.3.91514731.1568193098; s_fid=6B2A32676C919EA0-18B1CEF30B734D9F; cto_lwid=ea3236d3-ed59-41b9-aec8-d4417bfea11e; _fbp=fb.2.1568193098868.1203671795; cto_bundle=goym_V9NaTB2VFUwbFFkU0ZPRzhwZEhRR0ZDQXlqZXhtOGJQQWRQZXJuOUNFMlpJdjU5bjNSdkE4NiUyRm1JeUo4bHVHcVcwTTZYSHFzVlMyWUs1UXBveTk3Nkd1NXNEYnFZV0ZJYU9rNWpOTEdnd29lZmZHaWQyTkthTHNseFNUREIycUJs; _hjid=1a5b4d6e-1668-463e-8dc1-ba12be1f63e7; _hjDonePolls=438575; _hjMinimizedPolls=438575; __atuvc=3%7C37; frontend=2dc39a553daa4daa817a24664732e33f; nlbi_1902481=o7JuEMZA8hPPZfroknNDyQAAAACvodLb4dc5pfXEjz8P3EHR; incap_ses_936_1902481=IZgucSv3CEY06slFMln9DLF2hF0AAAAALvQr5crRNTQOPeNiXMpHPw==; s_cc=true; gpv_pn=men%27s%20%5Bl1%20category%20page%5D; gpv_v1=men%27s; s_sq=api-priceline-prd%3D%2526pid%253Dmen%252527s%252520%25255Bl1%252520category%252520page%25255D%2526pidt%253D1%2526oid%253DLOAD%252520MORE%252520PRODUCTS%2526oidt%253D3%2526ot%253DSUBMIT; _gid=GA1.3.707925260.1568962232; IR_gbd=priceline.com.au; IR_8928=1568968439537%7C0%7C1568964384675%7C%7C; gpv_v48=no%20value; gpv_v49=no%20value',
	// 	    		'Host':'www.priceline.com.au',
	// 	    		'Referer':'https://www.priceline.com.au/mens',
	// 	    		'TE':'Trailers'
	// 	  		}
	// 		  }, function(error, response, body) {
			    
	// 		    if (error) {
	// 		      console.log(error);	
	// 		      return;
	// 		    }else{

	// 		      dao.product.insertPriceline(body,element).then(setTimeout(getProduct,5000));
	// 		    }
	// 		  	});
	// 		}
			
				
	// 	// }

	// }

	// https://www.priceline.com.au/weight-and-vitamins
	// https://www.priceline.com.au/cosmetics
	// https://www.priceline.com.au/hair
	// https://www.priceline.com.au/skincare
	// https://www.priceline.com.au/fragrances
	// https://www.priceline.com.au/health
	// https://www.priceline.com.au/diet-and-nutrition
	// https://www.priceline.com.au/mens
	  
 //  (async () => {

 //  const browser = await pptrFirefox.launch({headless:false});
 //  const page = await browser.newPage();
  
 //  	await page.goto('https://www.priceline.com.au/mens');

	// await page.setViewport({
 //        width: 1200,
 //        height: 800
 //    });
 //  	await page.waitForSelector('body');

 //  	await page.click('#start-next-page');

 //  	await autoScroll(page);

 //  	await page.waitFor(5000);

 //  	// await autoScroll(page);

 //  	// await page.waitFor(5000);
  
 //  // 把網頁的body抓出來
 //  let body = await page.content();

 //  let $ = await cheerio.load(body);

 //  $('.item.type-simple').each((i, el) => {
	// 	let product_brand = $(el).find('.product-brand').text();
	// 	let product_link = $(el).find('.product-link').text();
	// 	let title = product_brand +" "+ product_link;
	// 	let link = $(el).find('a').attr('href');
	// 	let subTitle = link.split('/')[4];
	// 	let img = $(el).find('a img').attr('src');
	// 	let category = link.split('/')[3];
	// 	let priceBox = $(el).find('.price-box').text().replace(/\s\s+/g, '');
	// 	let price,discount,originPrice,id;
	// 	if(priceBox.substr(0,1) === '$'){
	// 		id = $(el).find('.price-box span').attr('id').split('-')[2];
	// 		price = parseFloat(priceBox.replace('$',''));
	// 		originPrice = price;
	// 		discount = 0;
	// 	}else{
	// 		id = id = $(el).find('.prev-price.price').attr('id').split('-')[2];
	// 		originPrice = parseFloat(priceBox.split('$')[1]);
	// 		price = parseFloat(priceBox.split('$')[2]);
	// 		discount = Math.floor((parseFloat(originPrice) - parseFloat(price))*100) / 100;
	// 	}
		 
	// 	let store = 'priceline';
 //    	let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};
 //    	// console.log(title);
	// 	conn.query("INSERT INTO product_p SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
	// 		if(err){
	// 			console.log(err);
	// 			return;
	// 		}
	// 		console.log('insert or update product')
	// 	});

	// });

 //  await browser.close();
	// })();
  

	// async function autoScroll(page){
	//     await page.evaluate(async () => {
	//         await new Promise((resolve, reject) => {
	//             var totalHeight = 0;
	//             var distance = 100;
	//             var timer = setInterval(() => {
	//                 var scrollHeight = document.body.scrollHeight;
	//                 window.scrollBy(0, distance);
	//                 totalHeight += distance;

	//                 if(totalHeight >= scrollHeight){
	//                     clearInterval(timer);
	//                     resolve();
	//                 }
	//             },400);
	//         });
	//     });
	// }

// 	async function scrollToBottom() {
//   await new Promise(resolve => {
//     const distance = 200; // should be less than or equal to window.innerHeight
//     const delay = 500;
//     const timer = setInterval(() => {

//       document.scrollingElement.scrollBy(0, distance);

//       if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
//         clearInterval(timer);
//         resolve();
//       }
//     }, delay);
//   });
// }

// 秒：0-59
// 分鐘：0-59
// 小時：0-23
// 天：1-31
// 月份：0-11（1月至12月）
// 星期幾：0-6（週日至週六）
new CronJob('0 0 3 * * 3', function() {
	// get vitamin product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))
	for(let i=1; i<77; i++){
	request({
	    url: `https://www1.chemistwarehouse.com.au/shop-online/81/vitamins?page=${i}`,
	    method: "GET"
	  }, function(error, res, body) {
	    if (error) {
	      console.log(error);	
	      return;
	    }else{
	    	dao.product.insertChemist(body).then(console.log('ok!'));

	  }
	});
	}
	
}, null, true, 'Australia/Sydney');


new CronJob('0 3 3 * * 3', function() {
	// get beauty product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))
	for(let i=1; i<291; i++){

		request({
		    url: `https://www.chemistwarehouse.com.au/Shop-Online/257/Beauty?page=${i}`,
		    method: "GET"
		  }, function(error, res, body) {
		    if (error) {
		      console.log(error);	
		      return;
		    }else{
		    	dao.product.insertChemist(body).then(console.log('ok!'));

		  }
		});
	}
	
}, null, true, 'Australia/Sydney');


new CronJob('0 6 3 * * 3', function() {
	// 105 page woolworths.com.au
	for(let i=1; i<106; i++){

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
		    	dao.product.insertWws(body).then(console.log('ok!'));
		    }
		});
	}
	
}, null, true, 'Australia/Sydney');

new CronJob('0 9 3 * * 3', function() {
	// Big W 
	let elements = [
		{c:'bath-body/c/6221/',p:10},
		{c:'dental-care/c/6210/',p:7},
		{c:'deodorant/c/6225/',p:6},
		{c:'fragrances/c/6211/',p:1},
		{c:'hair-care/c/6213/',p:41},
		{c:'health-care/c/6226/',p:12},
		{c:'makeup-cosmetics/c/6220/',p:61},
		{c:'shaving-grooming/c/6224/',p:9},
		{c:'skincare/c/6218/',p:30}
	];

	for(let element of elements){

		for(let i=0; i<element.p; i++){
			request({
			    url: `https://www.bigw.com.au/beauty-health/${element.c}?q=%3Arelevance&page=${i}`,
			    method: "GET"
			  }, function(error, response, body) {
			    if (error) {
			      console.log(error);	
			      return;
			    }else{
			      dao.product.insertBigw(body,element).then(console.log('ok!'));
		    }
		  });
		}
	}
	
}, null, true, 'Australia/Sydney');


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

// coles 
// let elements = [
// 	{c:'cosmetics',p:3},
	// {c:'dental',p:6},
	// {c:'first-aid',p:3},
	// {c:'hair-accessories',p:2},
	// {c:'hair-care',p:9},
	// {c:'hair-removal',p:4},
	// {c:'medicinal',p:13},
	// {c:'personal-care-hygiene',p:11},
	// {c:'shower-bath-care',p:7},
	// {c:'skin-care',p:8}
// ];

// for(let element of elements){
// 	for(let i=1; i<element.p; i++){
		// console.log(element.p,element.c);
		// (async () => {
		//   	const browser = await pptrFirefox.launch();
		//   	const page = await browser.newPage();
		//   	await page.goto(`https://shop.coles.com.au/a/a-vic-metro-richmond-south/everything/browse/health-beauty/cosmetics?pageNumber=1`);
		//   	// await page.goto(`https://shop.coles.com.au/a/a-vic-metro-richmond-south/everything/browse/health-beauty/${element.c}?pageNumber=${i}`);

		//   	//先等待網頁載入到底下的section的html標籤，不然有時候執行太快抓不到網頁
		//   	await page.waitForSelector('body');
		  
		//   	//把網頁的body抓出來
		//   	let body = await page.content();
		  
		//   	//送到 dao 處理
		//   	// dao.product.insertColes(body,element).then(console.log('ok!'));

		//   	let $ = await cheerio.load(body);

		//   	$('.product-header').each((i, el) => {
		// 		let data = $(el).html();
		//   		console.log(data)
		//   		console.log('test')
		// 	});

		//   	await browser.close();
		// })();
// 	}
// }

 //  (async () => {

 //  const browser = await pptrFirefox.launch();
 //  const page = await browser.newPage();
 //  await page.goto('https://www.priceline.com.au/weight-and-vitamins');
  
 //  await page.waitForSelector('body');
  
 //  await page.click('#start-next-page');
 
 //  let body = await page.content();
 //  console.log(body)
 //  //接著我們把他丟給cheerio去處理
 //  let $ = await cheerio.load(body);

 //  $('.product-header').each((i, el) => {
	// 	console.log($(el))
	

	// });

 //  await browser.close();
	// })();


//自動轉
// (async () => {
//     const browser = await pptrFirefox.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto('https://www.yoursite.com');
//     await page.setViewport({
//         width: 1200,
//         height: 800
//     });

//     await autoScroll(page);

//     await page.screenshot({
//         path: 'yoursite.png',
//         fullPage: true
//     });

//     await browser.close();
// })();

// async function autoScroll(page){
//     await page.evaluate(async () => {
//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;

//                 if(totalHeight >= scrollHeight){
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 100);
//         });
//     });
// }

