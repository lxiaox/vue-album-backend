const express = require('express'),
  server = express();
// 文件系统
var fs = require('fs')
// 解析body
var bodyParser = require('body-parser')
server.use(bodyParser.json({ limit:'10mb', extended:true }))
server.use(bodyParser.urlencoded({ limit:'10mb', extended: true }))
// date format
var dateTime = require('node-datetime');
// var dt = dateTime.create();
// var formatted = dt.format('Y-m-d H:M:S:MS');
// 设置端口
server.set('port', process.env.PORT || 3000);
// 跨域
server.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept, X-Requested-With");
  if (req.method == "OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
  else next();
})
//数据库连接
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/AlbumDB";
var ObjectID = require('mongodb').ObjectID
// 接口
require('./router1/signUp')(server, fs, MongoClient, url)
require('./router1/signIn')(server, fs, MongoClient, url)
require('./router1/getUserData')(server, fs, MongoClient, url, ObjectID)
require('./router1/getAlbums')(server, fs, MongoClient, url)
require('./router1/getOneAlbum')(server, fs, MongoClient, url, ObjectID)
require('./router1/addAlbum')(server, fs, MongoClient, url)
require('./router1/editAlbum')(server, fs, MongoClient, url, ObjectID)
require('./router1/deleteAlbum')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/getImages')(server, fs, MongoClient, url, ObjectID)
require('./router1/getImagesData')(server, fs, MongoClient, url, ObjectID)
require('./router1/addImage')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/deleteImage')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/setImageAsCover')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/editImageMessage')(server, fs, MongoClient, url, ObjectID)
require('./router1/addUpload')(server, fs, MongoClient, url, dateTime)
// test
// MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
//   if (err) throw err
//   let dbo = db.db("AlbumDB")
//   let lxx = 'lxx'
//   dbo.collection('lxx').rename('5cd653bda5cf664078a3c583')
// })

//Express error handling middleware
server.use((request, response) => {
  response.type('text/plain');
  response.status(505);
  response.send('系统服务异常,请稍后重试');
});
//Binding to a port
server.listen(3000, () => {
  console.log('Express server started at port 3000');
});