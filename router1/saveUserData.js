module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取用户信息
  server.post('/saveUserData', (request, response) => {
    let user = request.body.user
    let password = user.newPassword || user.password
    let avaterSrc = ''
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      if (user.avater) {
        avaterSrc = `./db1/albums/avaters/avater_${user.userId}.png`
        let avaterData = user.avater.replace(/^data:image\/\w+;base64,/, '')
        let dataBuffer = new Buffer(avaterData, 'base64')
        fs.writeFileSync(avaterSrc, dataBuffer)
      }
      dbo.collection('users').find({ 'userName': user.userName }).toArray(function (err, result) {
        if (err) throw err
        if (result[0] && (result[0]._id.toString() !== user._id) ) {
          response.status(400)
          response.send('用户名已存在')
          db.close();
          return
        }
        var whereStr = { "_id": ObjectID(user._id) };  // 查询条件
        var updateStr = {
          $set: {
            'userName': user.userName,
            'password': password,
            'gender': user.gender,
            'avaterSrc': avaterSrc
          }
        };
        dbo.collection('users').updateOne(whereStr, updateStr, function (err, res) {
          if (err) throw err;
          console.log("保存用户信息成功");
          response.sendStatus(200)
          db.close();
        });
      })

    })
  })
}