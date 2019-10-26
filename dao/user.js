const conn = require('../mysql.js');
const crypto = require('crypto');

module.exports = {
  create: function(email, name, pass) {
    return new Promise(function(resolve, reject) {
      conn.query('select email from user where email = ? and provider = "native"', email, function(
        err,
        results,
        fields
      ) {
        if (err) {
          reject({ error: 'user info not founded' });
          return;
        }

        if (!results.length) {
          const hash = crypto.createHash('sha256');
          hash.update(crypto.randomBytes(48));

          const userInsert = {
            provider: 'native',
            name: name,
            email: email,
            password: pass,
            token: hash.digest('hex'),
            token_expired: Date.now() + 1800000,
            picture: 'temp.jpg'
          };

          conn.query('insert into user set ?', userInsert, function(err, results, fields) {
            if (err) {
              reject({ error: 'user info not founded' });
              return;
            }

            conn.query('select * from user where email = ?', email, function(err, results, fields) {
              let user = {};
              user.id = results[0].id;
              user.provider = results[0].provider;
              user.name = results[0].name;
              user.email = results[0].email;
              user.picture = results[0].picture;

              const data = {};
              data.access_token = results[0].token;
              data.access_expired = results[0].token_expired;

              data.user = user;

              resolve({ data: data });
            });
          });
        } else {
          reject({ error: 'Invalid token.' });
        }
      });
    });
  },
  native: function(email, pass, provider) {
    return new Promise(function(resolve, reject) {
      conn.query(
        'select id from user where email = ? and password = ? and provider = "native"',
        [email, pass],
        function(err, results) {
          if (!results.length) {
            reject({ error: 'user info not founded' });
          } else {
            const hash = crypto.createHash('sha256');
            hash.update(crypto.randomBytes(48));
            const token = hash.digest('hex');
            const token_expired = Date.now() + 1800000;
            const id = results[0].id;

            conn.query(
              'UPDATE user SET token = ?, token_expired = ? WHERE id = ?',
              [token, token_expired, id],
              function(err, results) {
                if (err) {
                  reject({ error: 'Wroung request' });
                  return;
                }
                console.log('Rows affected:', results.affectedRows);

                conn.query('SELECT * FROM user WHERE id = ?', id, function(err, results) {
                  let data = {};
                  data.access_token = results[0].token;
                  data.access_expired = results[0].token_expired;

                  conn.query('SELECT * FROM wishlist WHERE user_id = ?', id, function(
                    err,
                    results
                  ) {
                    if (results.length > 0) {
                      const wishInfo = results;
                      data.wishInfo = wishInfo;
                    }

                    conn.query('SELECT * FROM tracklist WHERE user_id = ?', id, function(
                      err,
                      results
                    ) {
                      if (results.length > 0) {
                        const trackInfo = results;
                        data.trackInfo = trackInfo;
                      }
                      const signinResponse = { data: data };
                      resolve(signinResponse);
                    });
                  });
                });
              }
            );
          }
        }
      );
    });
  },
  FB: function(name, email) {
    return new Promise(function(resolve, reject) {
      conn.query(
        'SELECT id FROM user WHERE name = ? AND email = ? AND provider = "facebook"',
        [name, email],
        function(err, results) {
          if (!results.length) {
            const hash = crypto.createHash('sha256');
            hash.update(crypto.randomBytes(48));
            const userInsert = {
              provider: 'facebook',
              name: name,
              email: email,
              password: 0,
              token: hash.digest('hex'),
              token_expired: Date.now() + 1800000,
              picture: 'temp.jpg'
            };
            console.log(userInsert);
            conn.query('INSERT INTO user SET ?', userInsert, function(err, results) {
              if (err) {
                reject({ error: 'Wroung request' });
                return;
              }

              const data = {};
              data.access_token = userInsert.token;
              data.access_expired = userInsert.token_expired;
              const fbsigninResponse = { data: data };
              resolve(fbsigninResponse);
            });
          } else {
            const hash = crypto.createHash('sha256');
            hash.update(crypto.randomBytes(48));
            const token = hash.digest('hex');
            const token_expired = Date.now() + 1800000;
            const id = results[0].id;

            conn.query(
              'UPDATE user SET token = ?, token_expired = ? WHERE id = ?',
              [token, token_expired, id],
              function(err, results) {
                if (err) {
                  reject({ error: 'Wroung request' });
                  return;
                }

                conn.query('SELECT * FROM user WHERE id = ?', id, function(err, results) {
                  const data = {};
                  data.access_token = results[0].token;
                  data.access_expired = results[0].token_expired;

                  conn.query('SELECT * FROM wishlist WHERE user_id = ?', id, function(
                    err,
                    results
                  ) {
                    if (results.length > 0) {
                      const wishInfo = results;
                      data.wishInfo = wishInfo;
                    }

                    conn.query('SELECT * FROM tracklist WHERE user_id = ?', id, function(
                      err,
                      results
                    ) {
                      if (results.length > 0) {
                        const trackInfo = results;
                        data.trackInfo = trackInfo;
                      }
                      const fbsigninResponse = { data: data };
                      resolve(fbsigninResponse);
                    });
                  });
                });
              }
            );
          }
        }
      );
    });
  },
  check: function(accessToken) {
    return new Promise(function(resolve, reject) {
      conn.query('select * from user where token = ?', [accessToken], function(
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
            let user_id = results[0].id;
            resolve(user_id);
          }
        }
      });
    });
  },
  getUserEmail: function() {
    return new Promise(function(resolve, reject) {
      conn.query('select id,email,name from user', function(error, results, fields) {
        if (error) {
          reject({ error: 'Database Query Error' });
        } else {
          const data = results;
          resolve({ data });
        }
      });
    });
  }
};
