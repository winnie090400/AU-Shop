const conn = require("../mysql.js");
// const conn = require("../mysql.js").pool;
//const ec2 = require("../mysql.js").ec2;
const cheerio = require("cheerio");


module.exports={
	insertChemist:function(body,cate){
		return new Promise(function(resolve, reject){
			console.log(cate)
			let $ = cheerio.load(body);

			$('.product-container').each((i, el) => {
				let link = $(el).attr('href');

				let price = $(el).find('.Price').text().replace(/\s\s+/g, '').replace('$', '');

				let discount = $(el).find('.Price').next().text().replace(/\s\s+/g, '').replace(' Off RRP!','').replace('$', '');
				let none = $(el).find('.Price').next().attr('style');
				if(!discount || none == 'display:none'){
					discount ='0';
				}else{
					discount = discount;
				}
				
				let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;

				let category = cate;

				let data = {
					id: link.split("/")[2],
					category: category,
					link: 'chemistwarehouse.com.au'+link,
					title: $(el).attr('title').replace(' ', ''),
					subTitle: link.split("/")[3].split("?")[0],
					img: 'https://static.chemistwarehouse.com.au/ams/media/pi/'+ link.split("/")[2] +'/hero_150.jpg',
					price: parseFloat(price),
					discount: parseFloat(discount),
					originPrice:originPrice,
					store: 'chemistwarehouse'
				}
				// console.log(data)
				conn.query("INSERT INTO product_c SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
					if(err){

						console.log(err);
						return;
					}
					console.log('insert or update chemist product')
				});

			});
			
		});
	},
	insertWws:function(body){
		return new Promise(function(resolve, reject){

			for(let i=0; i<24; i++){
				let id = body.Bundles[i].Products[0].Stockcode;
				let category = body.Bundles[i].Products[0].AdditionalAttributes.sapsubcategoryname;
				let link = 'https://www.woolworths.com.au/shop/productdetails/'+ id + '/' + body.Bundles[i].Products[0].UrlFriendlyName;
				let subTitle = body.Bundles[i].Products[0].UrlFriendlyName + '-' + body.Bundles[i].Products[0].PackageSize;
				let title = body.Bundles[i].Name;
				let originPrice = body.Bundles[i].Products[0].WasPrice;
				let barcode = body.Bundles[i].Products[0].Barcode;
				let store = 'woolworths';
				let img = body.Bundles[i].Products[0].MediumImageFile;
				let price = body.Bundles[i].Products[0].Price;
				if(price == null){
					price = '0';
					originPrice = '0'
				}else{
					price = price;
					originPrice = originPrice;
				}
				let discount = originPrice - price;
				let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store,barcode};

				// console.log(data)
				conn.query("INSERT INTO product_w SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
					if(err){

						console.log(err);
						return;
					}
					console.log('insert or update wws product')
				});

			}
			
		});
	},
	insertBigw:function(body,element){
		
		return new Promise(function(resolve, reject){

			let $ = cheerio.load(body);
			// console.log(body)
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
	        	let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};

				conn.query("INSERT INTO product_b SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
					if(err){

						console.log(err);
						return;
					}
					console.log('insert or update bigw product')
				});
					        	
			});
			
		});
	},
	insertColes:function(body,element){
		let $ = cheerio.load(body);

	  	$('.product-header').each((i, el) => {
	  		let img = 'https://shop.coles.com.au'+$(el).find('.product-image img').attr('src');
	  		let title = $(el).find('.product-image img').attr('alt');
	  		let link = 'https://shop.coles.com.au'+$(el).find('.product-image-link').attr('href');
	  		let subTitle = link.split('/product/')[1];
			let id = img.split('/')[9].replace('-th.jpg','');
			let category = element.c;
			let price = parseInt($(el).find('.dollar-value').text().replace(/\s\s+/g, '')) + parseFloat($(el).find('.cent-value').text().replace(/\s\s+/g, ''));
			let discount = $(el).find('.product-save-value').text().replace(/\s\s+/g, '').replace('$','');
			if(!discount){
        		discount = 0;
        	}else{
        		discount = parseFloat(discount);
        	}
			let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;
			let store = 'coles';
			let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};
	    	
	    	// console.log(data)
			ec2.query("INSERT INTO product_co SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
				if(err){
					console.log(err);
					return;
				}
				console.log('insert or update coles product')
			});
	  		
		});
	},
	insertPriceline:function(body){

	  let $ = cheerio.load(body);

	  $('.item.type-simple').each((i, el) => {
			let product_brand = $(el).find('.product-brand').text();
			let product_link = $(el).find('.product-link').text();
			let title = product_brand +" "+ product_link;
			let link = $(el).find('a').attr('href');
			let subTitle = link.split('/')[4];
			let img = $(el).find('a img').attr('src');
			let category = link.split('/')[3];
			let priceBox = $(el).find('.price-box').text().replace(/\s\s+/g, '');
			let price,discount,originPrice,id;
			if(priceBox.substr(0,1) === '$'){
				id = $(el).find('.price-box span').attr('id').split('-')[2];
				price = parseFloat(priceBox.replace('$',''));
				originPrice = price;
				discount = 0;
			}else{
				id = id = $(el).find('.prev-price.price').attr('id').split('-')[2];
				originPrice = parseFloat(priceBox.split('$')[1]);
				price = parseFloat(priceBox.split('$')[2]);
				discount = Math.floor((parseFloat(originPrice) - parseFloat(price))*100) / 100;
			}
			 
			let store = 'priceline';
	    	let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};
	    	// console.log(title);
			ec2.query("INSERT INTO product_p SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
				if(err){
					console.log(err);
					return;
				}
				console.log('insert or update product')
			});

		});
	},
	// forIndex:function(size){
	// 	return new Promise(function(resolve, reject){
			
	// 		conn.query(`select * from product_w order by discount desc limit ?,${size} union all select * from product_c order by discount desc limit ?,${size} union all select * from product_b order by discount desc limit ?,${size} union all select * from product_p order by discount desc limit ?,${size} union all select * from product_co order by discount desc limit ?,${size}`, function(error, results, fields){
				
	// 			if(error){
	// 				reject("Database Query Error");
	// 			}else{	
					
	// 				resolve({data:results});	
					
	// 			}
	// 		});
			
	// 	});
	// },
	forIndex:function(size){
		return new Promise(function(resolve, reject){
			
			conn.query("select * from product_w order by discount desc limit ?,?", [0,size], function(error, results, fields){
				
				if(error){
					reject("Database Query Error");
				}else{	
					let wws = results;
					conn.query("select * from product_c order by discount desc limit ?,?", [0,size], function(error, results, fields){
						let chemist = results;
						conn.query("select * from product_b order by discount desc limit ?,?", [0,size], function(error, results, fields){
							let bigw = results;
							
							conn.query("select * from product_p order by discount desc limit ?,?", [0,size], function(error, results, fields){
								let priceline = results;
								
								conn.query("select * from product_co order by discount desc limit ?,?", [0,size], function(error, results, fields){
									let coles = results;
									resolve({wws,chemist,bigw,priceline,coles});
								});
							});
						});
					});
				}
			});
			
		});
	},
	search:function(size, accessToken, keyword){
		return new Promise(function(resolve, reject){
			
			let filter = "where title like "+conn.escape("%"+keyword+"%");
			let query=`select * from product_w ${filter} union all select * from product_c ${filter} union all select * from product_b ${filter} union all select * from product_co ${filter} union all select * from product_p ${filter} order by discount desc`;
			
			if(accessToken){
				conn.query("SELECT * FROM user WHERE token = ?", [accessToken], function(error, results, fields){
					if(error){
						reject("Database Query Error");
					}
					let user_id = results[0].id;
					conn.query("SELECT * FROM wishlist WHERE user_id = ?", [user_id], function(error, results, fields){
						if(error){
							reject("Database Query Error");
						}
						if(results.length > 0){
							let wish = results;
							conn.query(query, [0,size], function(error, results, fields){
				
								if(error){
									reject("Database Query Error");
								}else{	
									let data = results;
									resolve({data,wish});
								}
							
							});
						}else{
							conn.query(query, [0,size], function(error, results, fields){
				
								if(error){
									reject("Database Query Error");
								}else{	
									let data = results;
									resolve({data});
								}
							
							});
						}

					});
				});
			}else{
				conn.query(query, [0,size], function(error, results, fields){
				
					if(error){
						reject("Database Query Error");
					}else{	
						let data = results;
						resolve({data});
					}
				
				});
			}
				
			
		});
	},
	list:function(category, filters, size, accessToken, paging){
		
		return new Promise(function(resolve, reject){
	
			let offset=paging*size;
			let filter="";
			if(filters!==null){
				// if(filters.filter){
					filter=" where category like "+conn.escape(filters+"%");
					
				// }
				// else if(filters.keyword){
				// 	filter=" where title like "+conn.escape("%"+filters.keyword+"%");
					
				// }
			}

			let query=`select count(*) as total from product_${category.store}`;
			
			conn.query(query+filter, function(error, results, fields){
				if(error){
					reject("Database Query Error 1");
				}else{
				
					let maxPage=Math.floor((results[0].total-1)/size);
					if(paging<maxPage){
						paging=paging+1;
					}
										
					if(accessToken){
						conn.query("SELECT * FROM user WHERE token = ?", [accessToken], function(error, results, fields){
							if(error){
								reject("Database Query Error 2");
							}
							let user_id = results[0].id;
							conn.query("SELECT * FROM wishlist WHERE user_id = ?", [user_id], function(error, results, fields){
								if(error){
									reject("Database Query Error 3");
								}
								if(results.length > 0){
									let wish = results;
									
									conn.query(`select * from product_${category.store} `+filter+" order by discount desc limit ?,?", [offset,size], function(error, results, fields){
										
										if(error){
											reject("Database Query Error 4");
										}else{
											let data = results;

											conn.query(`select distinct category from product_${category.store}`, function(error, results, fields){
												let cate = [];
												for(let i=0; i<results.length; i++){
													cate.push(results[i].category);
												}
											
												resolve({paging,data,wish,cate});
											});
										}
									});
									
								}else{
									conn.query(`select * from product_${category.store} `+filter+" order by discount desc limit ?,?", [offset,size], function(error, results, fields){
										
										if(error){
											reject("Database Query Error 4");
										}else{
											let data = results;

											conn.query(`select distinct category from product_${category.store}`, function(error, results, fields){
												let cate = [];
												for(let i=0; i<results.length; i++){
													cate.push(results[i].category);
												}
											
												resolve({paging,data,cate});
											});
										}
									});
								}

							});
						});
					}else{

						conn.query(`select * from product_${category.store} `+filter+" order by discount desc limit ?,?", [offset,size], function(error, results, fields){
							
							if(error){
								reject("Database Query Error 4");
							}else{
								let data = results;

								conn.query(`select distinct category from product_${category.store}`, function(error, results, fields){
									let cate = [];
									for(let i=0; i<results.length; i++){
										cate.push(results[i].category);
									}
								
									resolve({paging,data,cate});
								});
							}
						});


					}
				}
			});
		});
	},
	get:function(productId,store){
		return new Promise(function(resolve, reject){

			let table;

			if(store === 'woolworths'){
				table = ['w','c','b','co','p'];
			}else if(store === 'chemistwarehouse'){
				table = ['c','w','b','co','p'];
			}else if(store === 'bigw'){
				table = ['b','c','w','co','p'];
			}else if(store === 'coles'){
				table = ['co','c','b','w','p'];
			}else if(store === 'priceline'){
				table = ['p','c','b','co','w'];
			}

			let query = `select * from product_${table[0]} where id = '${productId}'`;
	
			conn.query(query,function(error, results, fields){

				if(error){
					reject("Database Query Error");
				}else{
					
					let data = [];
					let product=results[0];
					data.push(product);
					let subTitle = results[0].subTitle;
					
					// 'cenovis-guarana-2000-ginseng-500-60'
					let searchFriendlyTitle = function(subTitle){
						let split_subTitle = subTitle.split('-');
						let y =[];
						for(let i=0; i<split_subTitle.length; i++){
							if(isNaN(parseInt(split_subTitle[i])) === false){
								// isNaN 回傳 false 是有數值
								let x = parseInt(split_subTitle[i]);
								y.push(x);
								
							}else{
								y.push(split_subTitle[i]);
							}

						}
						return y.join('-');
					}

					let subTitle2 = searchFriendlyTitle(subTitle).replace(/-/g,'%')+'%';
					
					let query1 = `select * from product_${table[1]} where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${table[2]} where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${table[3]} where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${table[4]} where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' order by price`;

					conn.query(query1, function(error, results, fields){
						if(error){
							reject("Database Query Error");
						}else{
							if(results.length > 0){
								
								for(let i=0; i<results.length; i++){
									data.push(results[i])
								}

								resolve({data:data});

							}else{
								resolve({data:data})
							}					
						}
					});
				}
			});
		});
	},
	wishlist:function(product_id,store,accessToken){

		return new Promise( function(resolve, reject){

			conn.query("SELECT * FROM user WHERE token = ?", [accessToken], function(error, results, fields){
				if(error){
					reject({error:"Database Query Error"});
				}else{
					if(results.length===0){
						reject({error:"Invalid Access Token"});
					}else{
						
						let user_id = results[0].id;
						let wishlist = {
							user_id:user_id,
							product_id:product_id,
							store:store
						}

						conn.query("SELECT * FROM wishlist WHERE user_id = ? AND product_id = ? AND store = ?", [user_id,product_id,store], function(error, results, fields){
							if(results.length===0){
								conn.query("INSERT INTO wishlist SET ?", wishlist, function(error, results, fields){
									if(error){
										reject({error:"Invalid add wishlist"});
									}
										resolve({data:"add"});
								})
							}else{
								
								conn.query(`DELETE FROM wishlist WHERE product_id = '${product_id}' and user_id = '${user_id}' and store = '${store}'` , function(error, results, fields){
									if(error){
										reject({error:"Invalid delete wishlist"});
									}
										resolve({data:"delete"});
								});
							}
						});
				 
					}
				}
			});	
			
		});
	},
	showWishlist:function(user_id){

		return new Promise(function(resolve, reject){
		
			conn.query(`SELECT * FROM wishlist inner join product_b on wishlist.product_id = product_b.id and wishlist.store = product_b.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_c on wishlist.product_id = product_c.id and wishlist.store = product_c.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_w on wishlist.product_id = product_w.id and wishlist.store = product_w.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_co on wishlist.product_id = product_co.id and wishlist.store = product_co.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_p on wishlist.product_id = product_p.id and wishlist.store = product_p.store and user_id =${user_id}`,  function(error, results, fields){

				if(results.length > 0){
					resolve({data:results});
					console.log(results)
				}
			});
		});

	
	},
	tracklist:function(product_id,store,user_id,price){

		return new Promise( function(resolve, reject){

			let tracklist = {
				user_id:user_id,
				product_id:product_id,
				store:store,
				price:price
			}

			conn.query("SELECT * FROM tracklist WHERE user_id = ? AND product_id = ? AND store = ?", [user_id,product_id,store], function(error, results, fields){
				if(results.length===0){
					conn.query("INSERT INTO tracklist SET ?", tracklist, function(error, results, fields){
						if(error){
							reject({error:"Invalid add wishlist"});
						}
							resolve({data:"add"});
					})
				}else{
					conn.query(`DELETE FROM tracklist WHERE product_id = ${product_id} AND store = '${store}'` , function(error, results, fields){
						if(error){
							reject({error:"Invalid delete wishlist"});
						}
							resolve({data:"delete"});
					});
				}
			});
		
		});
	},
	showTracklist:function(user_id){

		return new Promise(function(resolve, reject){
			
			let query = `SELECT * FROM tracklist inner join product_b on tracklist.product_id = product_b.id and tracklist.store = product_b.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_c on tracklist.product_id = product_c.id and tracklist.store = product_c.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_w on tracklist.product_id = product_w.id and tracklist.store = product_w.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_co on tracklist.product_id = product_co.id and tracklist.store = product_co.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_p on tracklist.product_id = product_p.id and tracklist.store = product_p.store and user_id =${user_id}`;
			
			conn.query(query, function(error, results, fields){
				if(results.length > 0){

					resolve({data:results});

				}
			});
		});
	}
	
};