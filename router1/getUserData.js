module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取用户信息
  server.get('/getUserData', (request, response) => {
    let userId = request.query.userId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection('users').find({ '_id': ObjectID(userId) }).toArray(function (err, result) {
        if (err) throw err;
        let user = result[0]
        let avaterData = 'data:image/jpeg;base64,'
        if (user.avaterSrc && fs.existsSync(`${user.avaterSrc}`)) {
          avaterData = avaterData + fs.readFileSync(`${item.avaterSrc}`, 'base64')
          usuer.avater = avaterData
        }
        response.status(200)
        response.send(user)
        db.close()
      })
    })
  })
}