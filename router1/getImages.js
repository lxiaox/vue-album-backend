module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取相册
  server.get('/getImages', (request, response) => {
    let userId = request.body.userId
    let albumId = request.body.albumId
    let returnImages = []
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereStr = {}
      if (albumId === 'all') {
        whereStr = {
          'userId': userId,
          'isDeleted': false
        }
      }else {
        whereStr = {
          'userId': userId,
          'albumId': albumId,
          'isDeleted': false
        }
      }
      dbo.collection('images').find(whereStr).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(201)
          response.send('未添加任何照片')
        } else {
          result.forEach(item => {
            let imageSrc = 'data:image/jpeg;base64,'
            imageSrc = imageSrc + fs.readFileSync(`${item.imageSrc}`, 'base64')
            returnImages.unshift({
              'imageId': item._id,
              'imageName': item.albumName,
              'imageSrc': imageSrc,
            })
          })
          response.status(200)
          response.send(returnImages)
        }
        db.close()
      })
    })
  })
}