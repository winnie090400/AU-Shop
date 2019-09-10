const request = require("request");
const cheerio = require("cheerio");
// const nodemailer = require('nodemailer');
// const conn = require('../mysql.js');


// for(let i=1; i<77; i++){
	
	// bath-body/c/6221/,10
	// dental-care/c/6210/,7
	// deodorant/c/6225/,6
	// fragrances/c/6211/,0
	// hair-care/c/6213/,41
	// health-care/c/6226/,12
	// makeup-cosmetics/c/6220/,61
	// shaving-grooming/c/6224/,9
	// skincare/c/6218/,30
// let cate = ['bath-body/c/6221/','dental-care/c/6210/','deodorant/c/6225/'];
// let p = [1,2,3].map(page);
// function page(num){
// 	for(let c of cate){
// 		// console.log(c);
// 		// console.log(num);
// 		for(let i=0; i<num; i++){
// 	request({
// 	    url: `https://www.bigw.com.au/beauty-health/${c}?q=%3Arelevance&page=${i}`,
// 	    method: "GET"
// 	  }, function(error, response, body) {
// 	    if (error) {
// 	      console.log(error);	
// 	      return;
// 	    }else{

// 			let $ = cheerio.load(body);

// 			$('.productSlot').each((i, el) => {
// 				let link = $(el).find('a').attr('href');
// 				let title = $(el).find('a').attr('title').replace(/\n\s+/g, '');
// 				let id = $(el).find('a').attr('data-product-code');
// 				let price = parseFloat($(el).find('.online-price.padding-right-zero').text().replace(/\s\s+/g, '.').replace('.$.', '').slice(0, -1));
// 	        	let img = 'https://www.bigw.com.au' + $(el).find('.image a').html().replace(/\s\s+/g, '').split(" ")[3].split('"')[1];
// 	        	let discount = $(el).find('.subText.save').text().replace(/\s\s+/g, '').replace('save $','');
// 	        	if(!discount){
// 	        		discount = 0;
// 	        	}else{
// 	        		discount = parseFloat(discount);
// 	        	}
// 	        	let category = c.split("/")[0];
// 	        	let subTitle = link.split("/")[4];
// 	        	let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;
// 	        	let store = 'bigw';
// 	        	// console.log({id,category,link,title,subTitle,img,price,discount,originPrice,store});
// 	        	console.log({category});
// 			});
// 	    }
// 	  });
// 	}
// 	}
// }
// }

	// bath-body/c/6221/,10
	// dental-care/c/6210/,7
	// deodorant/c/6225/,6
	// 
let elements = [
	// {c:'bath-body/c/6221/',p:10},
	// {c:'dental-care/c/6210/',p:7},
	{c:'deodorant/c/6225/',p:6},
	{c:'fragrances/c/6211/',p:1},
	// {c:'hair-care/c/6213/',p:41},
	// {c:'health-care/c/6226/',p:12},
	// {c:'makeup-cosmetics/c/6220/',p:61},
	// {c:'shaving-grooming/c/6224/',p:9},
	// {c:'skincare/c/6218/',p:30}
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

			let $ = cheerio.load(body);

			$('.productSlot').each((i, el) => {
				let link = $(el).find('a').attr('href');
				if(link.substr(0,1) == 'h'){
	        		link = link;
	        	}else{
	        		link = 'https://www.bigw.com.au' + link;
	        	}
				let title = $(el).find('a').attr('title');
				let id = $(el).find('a').attr('data-product-code');
				let price = parseFloat($(el).find('.online-price.padding-right-zero').text().replace(/\s\s+/g, '.').replace('.$.', '').slice(0, -1));
	        	let img = 'https://www.bigw.com.au' + $(el).find('.image a').html().replace(/\s\s+/g, '').split(" ")[3].split('"')[1];
	        	let discount = $(el).find('.subText.save').text().replace(/\s\s+/g, '').replace('save $','');
	        	if(!discount){
	        		discount = 0;
	        	}else{
	        		discount = parseFloat(discount);
	        	}
	        	let category = element.c.split("/")[0];
	        	let subTitle = link.split("/")[4];
	        	let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;
	        	let store = 'bigw';
	        	console.log({id,category,link,title,subTitle,img,price,discount,originPrice,store});
			});
	    }
	  });
	}
}

//get all vitamin product from chemistwarehouse and insert into database( table name: product_c )
// for(let i=1; i<77; i++){
// request({
//     url: `https://www1.chemistwarehouse.com.au/shop-online/81/vitamins?page=${i}`,
//     method: "GET"
//   }, function(error, res, body) {
//     if (error) {
//       console.log(error);	
//       return;
//     }else{
//     	// dao.product.insert(body).then(console.log('ok!'));
// 		let $ = cheerio.load(body);

// 		$('.product-container').each((i, el) => {
// 			let link = $(el).attr('href');

// 			let price = $(el).find('.Price').text().replace(/\s\s+/g, '').replace('$', '');

// 			let discount = $(el).find('.Price').next().text().replace(/\s\s+/g, '').replace(' Off RRP!','').replace('$', '');
//         	let none = $(el).find('.Price').next().attr('style');
//         	if(!discount || none == 'display:none'){
//         		discount ='0';
//         	}else{
//         		discount = discount;
//         	}
			
// 			let data = {
// 				id: link.split("/")[2],
// 				link: 'chemistwarehouse.com.au'+link,
// 				title: $(el).attr('title').replace(' ', ''),
// 				subTitle: link.split("/")[3].split("?")[0],
// 				img: 'https://static.chemistwarehouse.com.au/ams/media/pi/'+ link.split("/")[2] +'/hero_150.jpg',
// 				price: parseFloat(price),
// 				discount: parseFloat(discount),
// 				originPrice:Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100,
// 				store: 'chemistwarehouse'
// 			}
        	
//         	console.log(data);
// 		});
//     }
//   });
// }

//chemistwarehouse beauty
// for(let i=1; i<291; i++){
// request({
//     url: `https://www.chemistwarehouse.com.au/Shop-Online/257/Beauty?page=${i}`,
//     method: "GET"
//   }, function(error, response, body) {
//     if (error) {
//       console.log(error);	
//       return;
//     }else{
// 		let $ = cheerio.load(body);

// 		$('.product-container').each((i, el) => {
// 			let link = 'chemistwarehouse.com.au'+$(el).attr('href');
// 			let title = $(el).attr('title').replace(' ', '');
// 			let img = $(el).find('img').attr('src');
// 			let price = $(el).find('.Price').text().replace(/\s\s+/g, '');
//         	let discount = $(el).find('.Price').next().text().replace(/\s\s+/g, '').replace(' Off RRP!','');
//         	let none = $(el).find('.Price').next().attr('style');
//         	if(!discount || none == 'display:none'){
//         		discount ='0';
//         	}else{
//         		discount = discount;
//         	}
//         	console.log(`'chemistwarehouse',${title},${link},${img},${price},${discount} \n`);
// 		});
//     }
//   });
// }

//wws health & beauty page 158
// request({
//     url: 'https://www.woolworths.com.au/apis/ui/browse/category',
//     method: "POST",
//     json:{
//     	"categoryId":"1_894D0A8",
//     	"pageNumber":1,
//     	"pageSize":24,
//     	"sortType":"TraderRelevance",
//     	"url":"/shop/browse/health-beauty?pageNumber=1",
//     	"location":"/shop/browse/health-beauty",
//     	"formatObject":"{\"name\":\"Health & Beauty\"}",
//     	"isSpecial":false,"isBundle":false,
//     	"isMobile":true,
//     	"filters":null
//     }
//   }, function(error, response, body) {
//     if (error) {
//       console.log(error);	
//       return;
//     }else{
// 		for(let i=0; i<24; i++){
// 			let id = body.Bundles[i].Products[0].Stockcode;
// 			let category = body.Bundles[i].Products[0].AdditionalAttributes.sapsubcategoryname;
// 			let link = 'https://www.woolworths.com.au/shop/productdetails/'+ id + '/' + body.Bundles[i].Products[0].UrlFriendlyName;
// 			let subTitle = body.Bundles[i].Products[0].UrlFriendlyName;
// 			let title = body.Bundles[i].Name;
// 			let price = body.Bundles[i].Products[0].Price;
// 			let originPrice = body.Bundles[i].Products[0].WasPrice;
// 			let discount = originPrice - price;
// 			let barcode = body.Bundles[i].Products[0].Barcode;
// 			let img = 'https://cdn1.woolworths.media/content/wowproductimages/small/' + id + '.jpg';
// 			let data = {category,id,title,price,discount,originPrice,barcode,img,link,subTitle};
// 			console.log(data);
// 		}
//     }
//   });

// 台灣銀行
  // request({
  //   url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
  //   method: "GET"
  // }, function(error, response, body) {
  //   if (error) {
  //     console.log(error);	
  //     return;
  //   }else{
  //     let $ = cheerio.load(body);
	 //  let target = $(".rate-content-sight.text-right.print_hide");
  //     console.log('澳幣在台灣銀行換匯價格: '+ target[6].children[0].data);
  //   }
  // });

// United currency

// request({
//     url: "http://unitedcurrencyexchange.com.au/",
//     method: "GET"
//   }, function(error, response, body) {
//     if (error) {
//       console.log(error);	
//       return;
//     }else{
//       let $ = cheerio.load(body);
// 	  let target = $(".table-cell.sell-column.value.ng-binding");
//       console.log(target.initialize.prevObject: initialize);
      
//     }
//   });


// request({
//     url: "https://www1.chemistwarehouse.com.au/Shop-Online/257/Beauty?page=1",
//     method: "GET"
//   }, function(error, response, body) {
//     if (error) {
//       console.log(error);	
//       return;
//     }else{
// 		let $ = cheerio.load(body);
		// .replace(/\s\s+/g, '');
		// let target = $(".Save").parent().find('.Price').text().replace(/\s\s+/g, '\n');
		// let target = $(".Save").text().replace(/\s\s+/g, '\n');

		// let target = $(".product-list-container").text().replace(/\s\s+/g, '\n');
		// let target = $(".product-list-container").text().replace(/\s\s+/g, '\n');

		// let target = $('.product-container').attr('href').replace(/\s\s+/g, '\n');
		// let target = $('.prices').find('.Price').text().replace(/\s\s+/g, '\n');
		// let target = $(".Save").closest('.product-container').children().find('.price span').text();
		// let target = $(".Price").next().text().replace(/\s\s+/g, '\n');
		// let target = $(".Save").closest('.product-container').find('img').attr('src');
		// let link = $(".Save").closest('.product-container').parent().children('a').attr('href');
		// let title = $(".Save").closest('.product-container').parent().children('a').attr('title');
		// let img = $(".Save").parent().parent().find('img').attr('src');
		// let link = $(".Save").parent().parent().parent().parent().find('a').attr('href');
		// let title = $(".Save").parent().parent().parent().parent().find('a').attr('title');
		// console.log(target);


		// $('.Price').each((i, el) => {
		// 	// let discount = []; 
		// 	let dis = $(el).next().text().replace(/\s\s+/g, '').replace(' Off RRP!','').replace('$','');
  //       	if(!dis){
  //       		dis ='0';
  //       	}else{
  //       		dis = dis;
  //       	}

  //       	console.log(dis);
		// });

		// $('.product-container').each((i, el) => {
		// 	// let discount = []; 
		// 	// let link = $(el).find('.product-container').attr('href');
		// 	let link = $(el).attr('href');
		// 	let title = $(el).attr('title');
		// 	let img = $(el).find('img').attr('src');
		// 	let price = $(el).find('.Price').text().replace(/\s\s+/g, '');
  //       	let discount = $(el).find('.Price').next().text().replace(/\s\s+/g, '').replace(' Off RRP!','');
  //       	if(!discount){
  //       		discount ='0';
  //       	}else{
  //       		discount = discount;
  //       	}

  //       	console.log(`${title},${link},${img},${price},${discount} \n`);
		// });


  //   }
  // });



// const puppeteer = require('puppeteer');
// let scrape = async () => {
// const browser = await puppeteer.launch({headless: false});
// const page = await browser.newPage();
// await page.goto('https://shop.coles.com.au/a/a-vic-metro-richmond-south/everything/browse/health-beauty?pageNumber=1');
// const result = await page.evaluate(() => {
// let data = []; // 初始化空陣列來儲存資料
// let elements = page.waitForSelector('.dollar-value'); // 獲取所有書籍元素
// for (var element of elements){ // 迴圈
// // let title = element.childNodes[5].innerText; // 獲取標題
// // let price = element.childNodes[7].children[0].innerText; // 獲取價格
// // data.push({title, price}); // 存入陣列
// console.log(elements);
// console.log(element);
// }
// return data; // 返回資料
// });
// browser.close();
// return result;
// };
// scrape().then((value) => {
// console.log(value); // Success!
// });

// const puppeteer = require('puppeteer');
// let scrape = async () => {
// const browser = await puppeteer.launch({headless: false});
// const page = await browser.newPage();
// await page.goto('https://www1.chemistwarehouse.com.au/Shop-Online/257/Beauty?page=1');
// const result = await page.evaluate(() => {
// let data = []; // 初始化空陣列來儲存資料

// let elements = document.querySelectorAll('.product-container'); // 獲取所有書籍元素
// for (var element of elements){ // 迴圈
// let link = element.href; // 獲取標題
// let title = element.title;
// let a = element.childNodes[2];
// data.push({a}); // 存入陣列
// }

// let elements1 = document.querySelectorAll('> div > div.prices > span.Price'); // 獲取所有書籍元素
// for (var element of elements1){ // 迴圈
// let price = element.innerText; // 獲取標題

// data.push({price}); // 存入陣列
// }

// let elements = document.querySelectorAll('.product_image_overlay'); // 獲取所有書籍元素
// for (var element of elements){ // 迴圈
// let link = element.href; // 獲取標題
// let title = element.title;
// let a = element.childNodes[2];
// data.push({a}); // 存入陣列
// }

// return data; // 返回資料
// });
// browser.close();
// return result;
// };
// scrape().then((value) => {
// console.log(value); // Success!
// });
