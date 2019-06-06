const express = require('express'),
  server = express();
// 文件系统
var fs = require('fs')
// 解析body
var bodyParser = require('body-parser')
server.use(bodyParser.json({ limit: '10mb', extended: true }))
server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
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
// 登录注册
require('./router1/sign/signUp')(server, fs, MongoClient, url)
require('./router1/sign/signIn')(server, fs, MongoClient, url)
// 用户信息
require('./router1/user/getUserData')(server, fs, MongoClient, url, ObjectID)
require('./router1/user/saveUserData')(server, fs, MongoClient, url, ObjectID)
// 相册
require('./router1/album/getAlbums')(server, fs, MongoClient, url)
require('./router1/album/getAlbum')(server, fs, MongoClient, url, ObjectID)
require('./router1/album/addAlbum')(server, fs, MongoClient, url)
require('./router1/album/editAlbum')(server, fs, MongoClient, url, ObjectID)
require('./router1/album/deleteAlbum')(server, fs, MongoClient, url, dateTime, ObjectID)
// 照片
require('./router1/image/getImages')(server, fs, MongoClient, url, ObjectID)
require('./router1/image/getImagesData')(server, fs, MongoClient, url, ObjectID)
require('./router1/image/addImage')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/image/deleteImage')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/image/setImageAsCover')(server, fs, MongoClient, url, dateTime, ObjectID)
require('./router1/image/editImageMessage')(server, fs, MongoClient, url, ObjectID)
// 照片上传以及上传页
require('./router1/upload/addUpload')(server, fs, MongoClient, url, dateTime)
require('./router1/upload/getUploadsTree')(server, fs, MongoClient, url, ObjectID)
require('./router1/upload/deleteUpload')(server, fs, MongoClient, url, dateTime, ObjectID)
// 回收站
require('./router1/recycleBin/getDeletedAlbums')(server, fs, MongoClient, url, ObjectID)
require('./router1/recycleBin/getDeletedImages')(server, fs, MongoClient, url, ObjectID)
require('./router1/recycleBin/reAddAlbum')(server, fs, MongoClient, url, ObjectID)
require('./router1/recycleBin/reAddImage')(server, fs, MongoClient, url, ObjectID)


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