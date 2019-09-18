
const conn = require("./mysql.js");
const pptrFirefox = require('puppeteer-firefox');
const cheerio = require('cheerio');
const request = require("request");
const dao={
	product:require("./dao/product.js")
};
const CronJob = require('cron').CronJob;

//priceline  40秒爬一次含更新
// new CronJob('40 * * * * *', function() {
//   // console.log('You will see this message every second');
  // (async () => {

  // const browser = await pptrFirefox.launch();
  // const page = await browser.newPage();
  // await page.goto('https://www.priceline.com.au/');
  
  //先等待網頁載入到底下的section的html標籤，不然有時候執行太快抓不到網頁
  // await page.waitForSelector('body');
  
  //把網頁的body抓出來
  // let body = await page.content();
  // console.log(body)
  //接著我們把他丟給cheerio去處理
  // let $ = await cheerio.load(body);

  // $('.item.type-simple').each((i, el) => {
		// let title = $(el).find('a').attr('title');
		// console.log(title)

		// let discount = $(el).find('.prev-price.price').text().replace(/\s\s+/g, '').replace('$', '');
		// if(!discount){
		// 	discount ='0';
		// }else{
		// 	discount = discount;
		// }
		
		// let data = {
			
		// 	title:title,
		// 	discount: parseFloat(discount)
		// }
		// console.log(data)


		// conn.query("select * from product_p where title =?", title, function(err, results, fields){
		// 	if(err){

		// 		console.log(err);
		// 		return;
		// 	}else if(results.length === 0){
		// 		conn.query("insert into product_p set ?", data, function(err, results, fields){
		// 			if(err){

		// 				console.log(err);
		// 				return;
		// 			}
		// 			console.log('新增產品')

		// 		});
		// 	}else{
		// 		conn.query("update product_p set discount=? where title=?", [discount,title], function(err, results, fields){
		// 			if(err){

		// 				console.log(err);
		// 				return;
		// 			}
		// 			console.log('更新產品')

		// 		});
		// 	}

		// });
		

	// });

 //  await browser.close();
	// })();

// }, null, true, 'America/Los_Angeles');



// get vitamin product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))

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

// get beauty product from (sorce: chemistwarehouse.com.au, insert into database( table name: product_c ))
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

