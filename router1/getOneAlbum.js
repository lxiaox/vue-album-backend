module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取一个相册
  server.get('/getOneAlbum', (request, response) => {
    let albumId = request.query.albumId
    let returnAlbum = {}
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection('albums').find({ '_id': ObjectID(albumId) }).toArray(function (err, result) {
        if (err) throw err;
        let item = result[0]
        console.log(result)
        let cover = 'data:image/jpeg;base64,'
        if (item.coverSrc && fs.existsSync(`${item.coverSrc}`)) {
          cover = cover + fs.readFileSync(`${item.coverSrc}`, 'base64')
        } else {
          cover = cover + fs.readFileSync('./db1/defaultCover/defaultCover.png', 'base64')
        }
        returnAlbum = {
          'albumId': item._id,
          'albumName': item.albumName,
          'cover': cover,
          'imageCounts': item.imageCounts,
          'description': item.description,
          'classification': item.classification
        }
        response.status(200)
        response.send(returnAlbum)
        db.close()
      })
    })
  })
}