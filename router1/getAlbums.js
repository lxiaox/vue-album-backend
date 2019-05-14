module.exports = function (server, fs, MongoClient, url) {
  // 获取相册
  server.get('/getAlbums', (request, response) => {
    let userName = request.query.userName
    let returnAlbums = []
    // 读取allAlbum，按顺序排列
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection(userName).find({ 'isDeleted': false }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(404)
          response.send('用户还没有创建任何相册')
        } else {
          result.forEach(item => {
            let cover = 'data:image/jpeg;base64,'
            if (fs.existsSync(`${item.coverSrc}`)) {
              cover = cover + fs.readFileSync(`${item.coverSrc}`, 'base64')
            } else {
              cover = cover + fs.readFileSync('./db1/defaultCover/defaultCover.png', 'base64')
            }
            returnAlbums.unshift({ 'albumName': item.albumName, 'cover': cover, 'imageCounts':item.imageCounts })
          })
          response.status(200)
          response.send(returnAlbums)
        }
        db.close()
      })
    })
  })
}