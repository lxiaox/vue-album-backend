// 注册
module.exports = function (server, fs, MongoClient, url) {
  server.post('/signUp', (request, response) => {
    let user = request.body
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var inUse = 0
      dbo.collection('users').find({ 'userName': user.userName }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() !== '') {
          response.status(400)
          response.send('用户名被占用')
        } else {
          // users表增加信息
          dbo.collection('users').insertOne(user, function (err, res) {
            if (err) throw err;
            console.log('数据插入成功')
            response.status(200)
            response.send('注册成功')
            // 新增userName表, 新建文件夹
            if (!fs.existsSync(`./db1/albums/${user.userName}`)) {
              fs.mkdirSync(`./db1/albums/${user.userName}`)
            }
            dbo.createCollection(user.userName, function (err, res) {
              if (err) throw err;
              db.close();
            });
          })
        }
      })
    })
  })
}