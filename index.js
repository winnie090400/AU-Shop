const express = require('express');
const bodyParser = require('body-parser');
const crawler = require('./crawler.js');
const app = express();
const usersRouter = require('./route/user');
const apiRouter = require('./route/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use('/user', usersRouter);
app.use('/api/1.0', apiRouter);

app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});