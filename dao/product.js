const conn = require("../mysql.js");
const cheerio = require("cheerio");


module.exports={
	insertChemist:function(body){
		return new Promise(function(resolve, reject){

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

				let data = {
					id: link.split("/")[2],
					category: 'health & beauty',
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
					console.log('insert or update product')
				});
					        	
			});
			
		});
	},
	insertColes:function(body,element){
		return new Promise(function(resolve, reject){

			let $ = cheerio.load(body);

			$('.product-header').each((i, el) => {
				let data = $(el).text();
				console.log(data)
				// let link = $(el).find('a').attr('href');
				// if(link.substr(0,1) == 'h'){
	   //      		link = link;
	   //      	}else{
	   //      		link = 'https://www.bigw.com.au' + link;
	   //      	}
				// let title = $(el).find('a').attr('title');
				// let id = $(el).find('a').attr('data-product-code');
				// let price = parseFloat($(el).find('.online-price.padding-right-zero').text().replace(/\s\s+/g, '.').replace('.$.', '').slice(0, -1));
	   //      	let img = 'https://www.bigw.com.au' + $(el).find('.image a').html().replace(/\s\s+/g, '').split(" ")[3].split('"')[1];
	   //      	let discount = $(el).find('.subText.save').text().replace(/\s\s+/g, '').replace('save $','');
	   //      	if(!discount){
	   //      		discount = 0;
	   //      	}else{
	   //      		discount = parseFloat(discount);
	   //      	}
	   //      	let category = element.c.split("/")[0];
	   //      	let subTitle = link.split("/")[4];
	   //      	let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;
	   //      	let store = 'bigw';
	   //      	let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};

	        	
				// conn.query("INSERT INTO product_b SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
				// 	if(err){

				// 		console.log(err);
				// 		return;
				// 	}
				// 	console.log('insert or update product')
				// });
					        	
			});
			
		});
	},
	insertPriceline:function(body,element){
		return new Promise(function(resolve, reject){

			let $ = cheerio.load(body);

			$('.product-name.brand-name').each((i, el) => {
				let link = $(el).find('a').attr('href');
				console.log(link)
				// if(link.substr(0,1) == 'h'){
	   //      		link = link;
	   //      	}else{
	   //      		link = 'https://www.bigw.com.au' + link;
	   //      	}
				// let title = $(el).find('a').attr('title');
				// let id = $(el).find('a').attr('data-product-code');
				// let price = parseFloat($(el).find('.online-price.padding-right-zero').text().replace(/\s\s+/g, '.').replace('.$.', '').slice(0, -1));
	   //      	let img = 'https://www.bigw.com.au' + $(el).find('.image a').html().replace(/\s\s+/g, '').split(" ")[3].split('"')[1];
	   //      	let discount = $(el).find('.subText.save').text().replace(/\s\s+/g, '').replace('save $','');
	   //      	if(!discount){
	   //      		discount = 0;
	   //      	}else{
	   //      		discount = parseFloat(discount);
	   //      	}
	   //      	let category = element.c.split("/")[0];
	   //      	let subTitle = link.split("/")[4];
	   //      	let originPrice = Math.floor((parseFloat(price) + parseFloat(discount))*100) / 100;
	   //      	let store = 'bigw';
	   //      	let data = {id,category,link,title,subTitle,img,price,discount,originPrice,store};

	        	
				// conn.query("INSERT INTO product_b SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?", [data,originPrice,price,discount], function(err, results, fields){
				// 	if(err){

				// 		console.log(err);
				// 		return;
				// 	}
				// 	console.log('insert or update product')
				// });
					        	
			});
			
		});
	},
	forIndex:function(size, accessToken){
		return new Promise(function(resolve, reject){
			
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
							conn.query("select * from product_w order by discount desc limit ?,?", [0,size], function(error, results, fields){
				
							if(error){
								reject("Database Query Error");
							}else{	
								let wws = results;
								conn.query("select * from product_c order by discount desc limit ?,?", [0,size], function(error, results, fields){
									let chemist = results;
									conn.query("select * from product_b order by discount desc limit ?,?", [0,size], function(error, results, fields){
										let bigw = results;
										resolve({wws,chemist,bigw,wish});
									});
								});
							}
							});
						}

					});
				});
			}else{
				conn.query("select * from product_w order by discount desc limit ?,?", [0,size], function(error, results, fields){
					
					if(error){
						reject("Database Query Error");
					}else{	
						let wws = results;
						conn.query("select * from product_c order by discount desc limit ?,?", [0,size], function(error, results, fields){
							let chemist = results;
							conn.query("select * from product_b order by discount desc limit ?,?", [0,size], function(error, results, fields){
								let bigw = results;
								resolve({wws,chemist,bigw});
								console.log('無會員登入首頁');
							});
						});
					}
				});
			}
				
			
		});
	},
	search:function(size, accessToken, keyword){
		return new Promise(function(resolve, reject){
			
			let filter = "where title like "+conn.escape("%"+keyword+"%");
			let query=`select * from product_w ${filter} union all select * from product_c ${filter} union all select * from product_b ${filter} order by discount desc`;
			
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
			// console.log(filters)
			// console.log(paging)
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
			let query;
			let query1;
			let query2;
			if(store === "woolworths"){
				query='select * from product_w where id = ? and store = ?';
				query1='select * from product_c where id = ? or subTitle like ? or subTitle like ?';
				query2='select * from product_b where id = ? or subTitle like ? or subTitle like ?';
			}else if(store === 'chemistwarehouse'){
				query='select * from product_c where id = ? and store = ?';
				query1='select * from product_w where id = ? or subTitle like ? or subTitle like ?';
				query2='select * from product_b where id = ? or subTitle like ? or subTitle like ?';
			}else if(store == 'bigw'){
				query='select * from product_b where id = ? and store = ?';
				query1='select * from product_w where id = ? or subTitle like ? or subTitle like ?';
				query2='select * from product_c where id = ? or subTitle like ? or subTitle like ?';
			}

			conn.query(query, [productId,store],function(error, results, fields){
				if(error){
					reject("Database Query Error");
				}else{
					if(results.length===0){
						resolve(null);
					}else{
						// let data = [];
						let product=results[0];
						// data.push(product);
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
						console.log(searchFriendlyTitle('colgate-my-first-mild-mint-gel-kids-toothpaste-up-to-6-years-45g'))
						// console.log(subTitle2)
						conn.query(query1, [product.id,subTitle,subTitle2], function(error, results, fields){
							if(error){
								reject("Database Query Error");
							}else{
								if(results.length === 0){
									console.log('no product');
								}
								let product1 = results[0];
								// data.push(product1);
								// console.log(product1)
								conn.query(query2, [product.id,subTitle,subTitle2], function(error, results, fields){
									if(error){
										reject("Database Query Error");
									}else{
										if(results.length === 0){
											console.log('no product');
										}
										let product2 = results[0];
										// data.push(product2);
										// console.log(product2)
										resolve({data:[product,product1,product2]});

									}
								});
							}
						});

					}
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
								conn.query(`DELETE FROM wishlist WHERE product_id = ${product_id}` , function(error, results, fields){
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
		
			let b = new Promise(function(resolve, reject){conn.query('SELECT * FROM wishlist inner join product_b on wishlist.product_id = product_b.id and wishlist.store = product_b.store and user_id =?', [user_id], function(error, results, fields){

				if(results.length===0){
					resolve(null);
				}else{
					resolve(results);
				}
				});
			});

			let c = new Promise(function(resolve, reject){conn.query('SELECT * FROM wishlist inner join product_c on wishlist.product_id = product_c.id and wishlist.store = product_c.store and user_id =?', [user_id], function(error, results, fields){
				if(results.length===0){
					resolve(null);
				}else{
					resolve(results);
				}
				});
			});

			let w = new Promise(function(resolve, reject){conn.query('SELECT * FROM wishlist inner join product_w on wishlist.product_id = product_w.id and wishlist.store = product_w.store and user_id =?', [user_id], function(error, results, fields){
				if(results.length===0){
					resolve(null);
				}else{
					resolve(results);
				}
				});
			});

			
			Promise.all([w,b,c]).then(function(values){
				let data = [];
				
				resolve({data:values});
			})

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
			
			let query = `SELECT * FROM tracklist inner join product_b on tracklist.product_id = product_b.id and tracklist.store = product_b.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_c on tracklist.product_id = product_c.id and tracklist.store = product_c.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_w on tracklist.product_id = product_w.id and tracklist.store = product_w.store and user_id =${user_id}`;
			
			conn.query(query, function(error, results, fields){
				if(results.length===0){
					resolve({data:"no results"});
					
				}else{
					let data = results;
					resolve({data:data});
					
				}
			});
		});
	}
	
};


// list:function(filters, size, accessToken){
// 		return new Promise(function(resolve, reject){
// 			let offset=paging*size;
// 			let filter="";
// 			// if(filters!==null){
// 			// 	if(filters.where){
// 			// 		filter=filters.where;
// 			// 	}else if(filters.keyword){
// 			// 		filter=" where title like "+conn.escape("%"+filters.keyword+"%");
// 			// 	}else if(filters.category){
// 			// 		filter=" where category="+conn.escape(filters.category);
// 			// 	}
// 			// }
// 			let query="select count(*) as total from product_w";
// 			conn.query(query+filter, function(error, results, fields){
// 				if(error){
// 					reject("Database Query Error");
// 				}else{
// 					let maxPage=Math.floor((results[0].total-1)/size);
// 					let body={};
// 					if(paging<maxPage){
// 						body.paging=paging+1;
// 					}
// 					query="select * from product_w where discount >= price and price > 0";
					
// 					if(accessToken){
// 						conn.query("SELECT * FROM user WHERE token = ?", [accessToken], function(error, results, fields){
// 							if(error){
// 								reject("Database Query Error");
// 							}
// 							let user_id = results[0].id;
// 							conn.query("SELECT * FROM wishlist WHERE user_id = ?", [user_id], function(error, results, fields){
// 								if(error){
// 									reject("Database Query Error");
// 								}
// 								if(results.length > 0){
// 									let wish = results;
// 									conn.query("select * from product_w where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
						
// 									if(error){
// 										reject("Database Query Error");
// 									}else{	
// 										let wws = results;
// 										conn.query("select * from product_c where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
// 											let chemist = results;
// 											conn.query("select * from product_b where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
// 												let bigw = results;
// 												resolve({wws,chemist,bigw,wish});
// 											});
// 										});
// 									}
// 									});
// 								}

// 							});
// 						});
// 					}else{
// 						conn.query("select * from product_w where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
							
// 							if(error){
// 								reject("Database Query Error");
// 							}else{	
// 								let wws = results;
// 								conn.query("select * from product_c where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
// 									let chemist = results;
// 									conn.query("select * from product_b where discount >= price and price > 0 limit ?,?", [0,size], function(error, results, fields){
// 										let bigw = results;
// 										resolve({wws,chemist,bigw});
// 										console.log('無會員登入首頁');
// 									});
// 								});
// 							}
// 						});
// 					}
// 				}
// 			});
// 		});
// 	}