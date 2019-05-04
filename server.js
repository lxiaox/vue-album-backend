const express = require('express'),
      server = express();
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

require('./router/sign_in')(server,fs)
require('./router/sign_up')(server,fs)
require('./router/getAlbums')(server,fs)
require('./router/getImages')(server,fs)
require('./router/addAlbum')(server,fs)
require('./router/addImage')(server,fs)

//Express error handling middleware
server.use((request, response) => {
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});

//
//

//Binding to a port
server.listen(3000, () => {
  console.log('Express server started at port 3000');
});