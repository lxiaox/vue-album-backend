const express = require('express'),
      server = express();
// 文件系统
var fs = require('fs')
// 解析body
var bodyParser = require('body-parser')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended:true}))
// 设置端口
server.set('port', process.env.PORT || 3000);
// 跨域
server.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept, X-Requested-With");
  if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
  else next();
})
//数据库连接
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/AlbumDB";
var dbase
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log("数据库已连接/创建!");
  dbase = db.db("AlbumDB");
  dbase.createCollection('test')
});

// 接口
require('./router1/signUp')(server,fs,dbase)


//Express error handling middleware
server.use((request, response) => {
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});
//Binding to a port
server.listen(3000, () => {
  console.log('Express server started at port 3000');
});