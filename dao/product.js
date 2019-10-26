const conn = require('../mysql.js');
const cheerio = require('cheerio');

module.exports = {
  insertChemist: function(body, cate) {
    return new Promise(function(resolve, reject) {
      const $ = cheerio.load(body);

      $('.product-container').each((i, el) => {
        const link = $(el).attr('href');
        const price = $(el)
          .find('.Price')
          .text()
          .replace(/\s\s+/g, '')
          .replace('$', '');
        let discount = $(el)
          .find('.Price')
          .next()
          .text()
          .replace(/\s\s+/g, '')
          .replace(' Off RRP!', '')
          .replace('$', '');
        const none = $(el)
          .find('.Price')
          .next()
          .attr('style');
        const id = link.split('/')[2];

        if (!discount || none == 'display:none') {
          discount = '0';
        } else {
          discount = discount;
        }

        const originPrice = Math.floor((parseFloat(price) + parseFloat(discount)) * 100) / 100;
        const category = cate;

        const data = {
          id: id,
          category: category,
          link: 'chemistwarehouse.com.au' + link,
          title: $(el)
            .attr('title')
            .replace(' ', ''),
          subTitle: link.split('/')[3].split('?')[0],
          img:
            'https://static.chemistwarehouse.com.au/ams/media/pi/' +
            link.split('/')[2] +
            '/hero_150.jpg',
          price: parseFloat(price),
          discount: parseFloat(discount),
          originPrice: originPrice,
          store: 'chemistwarehouse'
        };

        conn.query(
          'INSERT INTO product_c SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?',
          [data, originPrice, price, discount],
          function(err, results, fields) {
            if (err) {
              console.log(err);
              return;
            }
            console.log('insert or update chemist product');
          }
        );
      });
    });
  },
  insertWws: function(body) {
    return new Promise(function(resolve, reject) {
      for (let i = 0; i < 24; i++) {
        const id = body.Bundles[i].Products[0].Stockcode;
        const category = body.Bundles[i].Products[0].AdditionalAttributes.sapsubcategoryname;
        const link =
          'https://www.woolworths.com.au/shop/productdetails/' +
          id +
          '/' +
          body.Bundles[i].Products[0].UrlFriendlyName;
        const subTitle =
          body.Bundles[i].Products[0].UrlFriendlyName +
          '-' +
          body.Bundles[i].Products[0].PackageSize;
        const title = body.Bundles[i].Name;
        let originPrice = body.Bundles[i].Products[0].WasPrice;
        const barcode = body.Bundles[i].Products[0].Barcode;
        const store = 'woolworths';
        const img = body.Bundles[i].Products[0].MediumImageFile;
        let price = body.Bundles[i].Products[0].Price;

        if (price == null) {
          price = '0';
          originPrice = '0';
        } else {
          price = price;
          originPrice = originPrice;
        }

        const discount = originPrice - price;
        const data = {
          id,
          category,
          link,
          title,
          subTitle,
          img,
          price,
          discount,
          originPrice,
          store,
          barcode
        };
        const isAvailable = body.Bundles[i].Products[0].IsAvailable;

        if (isAvailable) {
          conn.query(
            'INSERT INTO product_w SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?',
            [data, originPrice, price, discount],
            function(err, results, fields) {
              if (err) {
                console.log(err);
                return;
              }

              console.log('insert or update wws product');
            }
          );

          conn.query(
            `INSERT INTO product_w_copy (id) VALUES ('${id}') ON DUPLICATE KEY UPDATE id=?`,
            [id],
            function(err, results, fields) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('insert into product_w_copy');
            }
          );
        } else {
          conn.query('DELETE FROM product_w WHERE id = ?', id, function(err, results, fields) {
            if (err) {
              console.log(err);
              return;
            }
            console.log('delete wws product ' + id);
          });
        }
      }
    });
  },
  insertBigw: function(body, element) {
    return new Promise(function(resolve, reject) {
      const $ = cheerio.load(body);

      $('.productSlot').each((i, el) => {
        let link = $(el)
          .find('a')
          .attr('href');

        if (link.substr(0, 1) == 'h') {
          link = link;
        } else {
          link = 'https://www.bigw.com.au' + link;
        }

        const title = $(el)
          .find('a')
          .attr('title');
        const id = $(el)
          .find('a')
          .attr('data-product-code');
        const price = parseFloat(
          $(el)
            .find('.online-price.padding-right-zero')
            .text()
            .replace(/\s\s+/g, '.')
            .replace('.$.', '')
            .slice(0, -1)
        );
        const img =
          'https://www.bigw.com.au' +
          $(el)
            .find('.image a')
            .html()
            .replace(/\s\s+/g, '')
            .split(' ')[3]
            .split('"')[1];
        let discount = $(el)
          .find('.subText.save')
          .text()
          .replace(/\s\s+/g, '')
          .replace('save $', '');

        if (!discount) {
          discount = 0;
        } else {
          discount = parseFloat(discount);
        }

        const category = element.c.split('/')[0];
        const subTitle = link.split('/')[4];
        const originPrice = Math.floor((parseFloat(price) + parseFloat(discount)) * 100) / 100;
        const store = 'bigw';
        const data = {
          id,
          category,
          link,
          title,
          subTitle,
          img,
          price,
          discount,
          originPrice,
          store
        };

        conn.query(
          'INSERT INTO product_b SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?',
          [data, originPrice, price, discount],
          function(err, results, fields) {
            if (err) {
              console.log(err);
              return;
            }

            console.log('insert or update bigw product');
          }
        );

        conn.query(
          `INSERT INTO product_b_copy (id) VALUES ('${id}') ON DUPLICATE KEY UPDATE id=?`,
          [id],
          function(err, results, fields) {
            if (err) {
              console.log(err);
              return;
            }
            console.log('insert into product_b_copy');
          }
        );
      });
    });
  },
  insertColes: function(body, element) {
    const $ = cheerio.load(body);

    $('.product-header').each((i, el) => {
      const img =
        'https://shop.coles.com.au' +
        $(el)
          .find('.product-image img')
          .attr('src');
      const title = $(el)
        .find('.product-image img')
        .attr('alt');
      const link =
        'https://shop.coles.com.au' +
        $(el)
          .find('.product-image-link')
          .attr('href');
      const subTitle = link.split('/product/')[1];
      const id = img.split('/')[9].replace('-th.jpg', '');
      const category = element.c;
      const price =
        parseInt(
          $(el)
            .find('.dollar-value')
            .text()
            .replace(/\s\s+/g, '')
        ) +
        parseFloat(
          $(el)
            .find('.cent-value')
            .text()
            .replace(/\s\s+/g, '')
        );
      let discount = $(el)
        .find('.product-save-value')
        .text()
        .replace(/\s\s+/g, '')
        .replace('$', '');

      if (!discount) {
        discount = 0;
      } else {
        discount = parseFloat(discount);
      }

      const originPrice = Math.floor((parseFloat(price) + parseFloat(discount)) * 100) / 100;
      const store = 'coles';
      const data = {
        id,
        category,
        link,
        title,
        subTitle,
        img,
        price,
        discount,
        originPrice,
        store
      };

      conn.query(
        'INSERT INTO product_co SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?',
        [data, originPrice, price, discount],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            return;
          }
          console.log('insert or update coles product');
        }
      );
    });
  },
  insertPriceline: function(body) {
    const $ = cheerio.load(body);

    $('.item.type-simple').each((i, el) => {
      const productBrand = $(el)
        .find('.product-brand')
        .text();
      const productLink = $(el)
        .find('.product-link')
        .text();
      const title = productBrand + ' ' + productLink;
      const link = $(el)
        .find('a')
        .attr('href');
      const subTitle = link.split('/')[4];
      const img = $(el)
        .find('a img')
        .attr('src');
      const category = link.split('/')[3];
      const priceBox = $(el)
        .find('.price-box')
        .text()
        .replace(/\s\s+/g, '');
      let price;
      let discount;
      let originPrice;
      let id;

      if (priceBox.substr(0, 1) === '$') {
        id = $(el)
          .find('.price-box span')
          .attr('id')
          .split('-')[2];
        price = parseFloat(priceBox.replace('$', ''));
        originPrice = price;
        discount = 0;
      } else {
        id = id = $(el)
          .find('.prev-price.price')
          .attr('id')
          .split('-')[2];
        originPrice = parseFloat(priceBox.split('$')[1]);
        price = parseFloat(priceBox.split('$')[2]);
        discount = Math.floor((parseFloat(originPrice) - parseFloat(price)) * 100) / 100;
      }

      const store = 'priceline';
      const data = {
        id,
        category,
        link,
        title,
        subTitle,
        img,
        price,
        discount,
        originPrice,
        store
      };

      conn.query(
        'INSERT INTO product_p SET ? ON DUPLICATE KEY UPDATE originPrice=?,price=?,discount=?',
        [data, originPrice, price, discount],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            return;
          }

          console.log('insert or update product');
        }
      );
    });
  },
  forIndex: function(size) {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * FROM product_w ORDER BY discount DESC LIMIT ?,?', [0, size], function(
        error,
        results,
        fields
      ) {
        if (error) {
          reject(error);
        } else {
          const wws = results;
          conn.query(
            'SELECT * FROM product_c ORDER BY discount DESC LIMIT ?,?',
            [0, size],
            function(error, results, fields) {
              const chemist = results;
              conn.query(
                'SELECT * FROM product_b ORDER BY discount DESC LIMIT ?,?',
                [0, size],
                function(error, results, fields) {
                  const bigw = results;

                  conn.query(
                    'SELECT * FROM product_p ORDER BY discount DESC LIMIT ?,?',
                    [0, size],
                    function(error, results, fields) {
                      const priceline = results;

                      conn.query(
                        'SELECT * FROM product_co ORDER BY discount DESC LIMIT ?,?',
                        [0, size],
                        function(error, results, fields) {
                          const coles = results;
                          resolve({ wws, chemist, bigw, priceline, coles });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      });
    });
  },
  search: function(size, keyword) {
    return new Promise(function(resolve, reject) {
      const keywords = keyword.replace(/\s+/g, '%');
      const filter = 'WHERE title LIKE ' + conn.escape('%' + keywords + '%');
      const query = `SELECT * FROM product_w ${filter} UNION ALL SELECT * FROM product_c ${filter} UNION ALL SELECT * FROM product_b ${filter} UNION ALL SELECT * FROM product_co ${filter} UNION ALL SELECT * FROM product_p ${filter} ORDER BY discount DESC`;

      conn.query(query, [0, size], function(error, results, fields) {
        if (error) {
          reject(error);
        } else {
          const data = results;
          resolve({ data });
        }
      });
    });
  },
  list: function(category, filters, size, paging) {
    return new Promise(function(resolve, reject) {
      const offset = paging * size;
      let filter = '';

      if (filters !== null) {
        filter = ' where category like ' + conn.escape(filters + '%');
      }

      const query = `select count(*) as total from product_${category.store}`;

      conn.query(query + filter, function(error, results, fields) {
        if (error) {
          reject(error);
        } else {
          const maxPage = Math.floor((results[0].total - 1) / size);
          if (paging < maxPage) {
            paging = paging + 1;
          }

          conn.query(
            `select * from product_${category.store} ` +
              filter +
              ' order by discount desc limit ?,?',
            [offset, size],
            function(error, results, fields) {
              if (error) {
                reject(error);
              } else {
                const data = results;

                conn.query(`select distinct category from product_${category.store}`, function(
                  error,
                  results,
                  fields
                ) {
                  const cate = [];
                  for (let i = 0; i < results.length; i++) {
                    cate.push(results[i].category);
                  }

                  resolve({ paging, data, cate });
                });
              }
            }
          );
        }
      });
    });
  },
  get: function(productId, store) {
    return new Promise(function(resolve, reject) {
      let table;

      if (store === 'woolworths') {
        table = ['w', 'c', 'b', 'co', 'p'];
      } else if (store === 'chemistwarehouse') {
        table = ['c', 'w', 'b', 'co', 'p'];
      } else if (store === 'bigw') {
        table = ['b', 'c', 'w', 'co', 'p'];
      } else if (store === 'coles') {
        table = ['co', 'c', 'b', 'w', 'p'];
      } else if (store === 'priceline') {
        table = ['p', 'c', 'b', 'co', 'w'];
      }

      const query = `select * from product_${table[0]} where id = '${productId}'`;

      conn.query(query, function(error, results, fields) {
        if (error) {
          reject(error);
        } else {
          const data = [];
          const product = results[0];
          data.push(product);
          const subTitle = results[0].subTitle;

          const searchFriendlyTitle = function(subTitle) {
            const splitSubTitle = subTitle.split('-');
            const y = [];

            for (let i = 0; i < splitSubTitle.length; i++) {
              if (isNaN(parseInt(splitSubTitle[i])) === false) {
                // isNaN 回傳 false 是有數值
                const x = parseInt(splitSubTitle[i]);
                y.push(x);
              } else {
                y.push(splitSubTitle[i]);
              }
            }
            return y.join('-');
          };

          const subTitle2 = searchFriendlyTitle(subTitle).replace(/-/g, '%') + '%';

          const query1 = `select * from product_${
            table[1]
          } where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${
            table[2]
          } where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${
            table[3]
          } where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' union all select * from product_${
            table[4]
          } where id = '${productId}' or subTitle like '${subTitle}' or subTitle like '${subTitle2}' order by price`;

          conn.query(query1, function(error, results, fields) {
            if (error) {
              reject(error);
            } else {
              if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                  data.push(results[i]);
                }

                resolve({ data: data });
              } else {
                resolve({ data: data });
              }
            }
          });
        }
      });
    });
  },
  wishlist: function(product_id, store, accessToken) {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * FROM user WHERE token = ?', [accessToken], function(
        error,
        results,
        fields
      ) {
        if (error) {
          reject({ error: 'Database Query Error' });
        } else {
          if (results.length === 0) {
            reject({ error: 'Invalid Access Token' });
          } else {
            const user_id = results[0].id;
            const wishlist = {
              user_id: user_id,
              product_id: product_id,
              store: store
            };

            conn.query(
              'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ? AND store = ?',
              [user_id, product_id, store],
              function(error, results, fields) {
                if (results.length === 0) {
                  conn.query('INSERT INTO wishlist SET ?', wishlist, function(
                    error,
                    results,
                    fields
                  ) {
                    if (error) {
                      reject({ error: 'Invalid add wishlist' });
                    }
                    resolve({ data: 'add' });
                  });
                } else {
                  conn.query(
                    `DELETE FROM wishlist WHERE product_id = '${product_id}' and user_id = '${user_id}' and store = '${store}'`,
                    function(error, results, fields) {
                      if (error) {
                        reject({ error: 'Invalid delete wishlist' });
                      }
                      resolve({ data: 'delete' });
                    }
                  );
                }
              }
            );
          }
        }
      });
    });
  },
  showWishlist: function(user_id) {
    return new Promise(function(resolve, reject) {
      conn.query(
        `SELECT * FROM wishlist inner join product_b on wishlist.product_id = product_b.id and wishlist.store = product_b.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_c on wishlist.product_id = product_c.id and wishlist.store = product_c.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_w on wishlist.product_id = product_w.id and wishlist.store = product_w.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_co on wishlist.product_id = product_co.id and wishlist.store = product_co.store and user_id =${user_id} union all SELECT * FROM wishlist inner join product_p on wishlist.product_id = product_p.id and wishlist.store = product_p.store and user_id =${user_id}`,
        function(error, results, fields) {
          if (results.length > 0) {
            resolve({ data: results });
          }
        }
      );
    });
  },
  tracklist: function(product_id, store, user_id, price) {
    return new Promise(function(resolve, reject) {
      const tracklist = {
        user_id: user_id,
        product_id: product_id,
        store: store,
        price: price
      };

      conn.query(
        'SELECT * FROM tracklist WHERE user_id = ? AND product_id = ? AND store = ?',
        [user_id, product_id, store],
        function(error, results, fields) {
          if (results.length === 0) {
            conn.query('INSERT INTO tracklist SET ?', tracklist, function(error, results, fields) {
              if (error) {
                reject({ error: 'Invalid add tracklist' });
              }
              resolve({ data: 'add' });
            });
          } else {
            conn.query(
              'DELETE FROM tracklist WHERE product_id = ? AND store = ?',
              [product_id, store],
              function(error, results, fields) {
                if (error) {
                  reject({ error: 'Invalid delete tracklist' });
                }
                resolve({ data: 'delete' });
              }
            );
          }
        }
      );
    });
  },
  showTracklist: function(user_id) {
    return new Promise(function(resolve, reject) {
      const query = `SELECT * FROM tracklist inner join product_b on tracklist.product_id = product_b.id and tracklist.store = product_b.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_c on tracklist.product_id = product_c.id and tracklist.store = product_c.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_w on tracklist.product_id = product_w.id and tracklist.store = product_w.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_co on tracklist.product_id = product_co.id and tracklist.store = product_co.store and user_id =${user_id} UNION ALL SELECT * FROM tracklist inner join product_p on tracklist.product_id = product_p.id and tracklist.store = product_p.store and user_id =${user_id}`;

      conn.query(query, function(error, results, fields) {
        if (results.length > 0) {
          resolve({ data: results });
        }
      });
    });
  },
  createTable: function(tableName) {
    const query = `CREATE TABLE ${tableName} (id VARCHAR(20) PRIMARY KEY)`;

    conn.query(query, function(err, results, fields) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Table created');
    });
  },
  dropTable: function(tableName) {
    const query = `DROP TABLE ${tableName}`;

    conn.query(query, function(err, results, fields) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Table deleted');
    });
  },
  delete: function(tableName) {
    return new Promise(function(resolve, reject) {
      const copyTable = tableName + '_copy';

      conn.query(
        `select count(*) as total from ${tableName} union all select count(*) as total from ${copyTable}`,
        function(err, results, fields) {
          if (err) {
            console.log(err);
            return;
          }

          const count = results[0].total;
          const count_copy = results[1].total;

          if (count * 0.05 > count_copy) {
            console.log('do crawler again');
            reject({ error: 'do crawler again' });
          } else {
            conn.query(
              `DELETE FROM ${tableName} WHERE id NOT IN (SELECT id from ${copyTable})`,
              function(err, results, fields) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('delete product');
                resolve({ data: 'delete product' });
              }
            );
          }
        }
      );
    });
  }
};
