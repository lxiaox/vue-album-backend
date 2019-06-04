module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取用户信息
  server.get('/getUserData', (request, response) => {
    let userId = request.query.userId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      if(!userId) {
        response.sendStatus(400)
        return
      }
      dbo.collection('users').find({ '_id': ObjectID(userId) }).toArray(function (err, result) {
        if (err) throw err;
        let user = result[0]
        let avaterData = 'data:image/jpeg;base64,'
        if (user.avaterSrc && fs.existsSync(`${user.avaterSrc}`)) {
          avaterData = avaterData + fs.readFileSync(`${user.avaterSrc}`, 'base64')
          user.avater = avaterData
        } else {
          user.avater = ''
        }
        response.status(200)
        response.send(user)
        db.close()
      })
    })
  })
}