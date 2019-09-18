// MySQL Initialization
const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit : 100,  //最大連線數量
	host:"localhost",
	user:"root",
	password:"123456789",
	database:"crawler"

});

pool.getConnection((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

module.exports = pool;




