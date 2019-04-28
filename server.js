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
// 注册
server.post('/sign_up', (request, response) => {
  let user = request.body
  let users = fs.readFileSync('./db/users', 'utf8')
  try{
    users = JSON.parse(users)
  }catch(exception){
    users = []
  }
  let inUse = false
  for(let i=0; i<users.length; i++){
    if(user.userName === users[i]['userName']){
      inUse = true
    }
  }
  if(inUse === true){
    response.status(400)
    response.send('用户名被占用')
  }else{
    users.push(user)
    let usersString = JSON.stringify(users)
    fs.writeFileSync('./db/users', usersString)
    response.sendStatus(200)
  }
})

server.get('/home/getAlbums', (request, response) => {
  response.send('About Albums');
});

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