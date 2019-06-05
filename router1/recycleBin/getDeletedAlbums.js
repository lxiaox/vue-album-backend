module.exports = function (server, fs, MongoClient, url) {
  // 获取相册
  server.get('/getDeletedAlbums', (request, response) => {
    let userId = request.query.userId
    let returnAlbums = []
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection('albums').find({ 'userId': userId, 'isDeleted': true }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(201)
          response.send('没有删除相册')
        } else {
          result.forEach(item => {
            let cover = 'data:image/jpeg;base64,'
            if (item.coverSrc && fs.existsSync(`${item.coverSrc}`)) {
              cover = cover + fs.readFileSync(`${item.coverSrc}`, 'base64')
            } else {
              cover = cover + fs.readFileSync('./db1/defaultCover/defaultCover.png', 'base64')
            }
            returnAlbums.unshift({
              'albumId': item._id,
              'albumName': item.albumName,
              'cover': cover,
              'imageCounts': item.imageCounts,
              'description': item.description,
              'classification': item.classification
            })
          })
          response.status(200)
          response.send(returnAlbums)
        }
        db.close()
      })
    })
  })
}