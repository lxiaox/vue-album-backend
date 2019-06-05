module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取图片
  server.get('/getDeletedImages', (request, response) => {
    let userId = request.query.userId
    let returnImages = []
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereStr = {
        'userId': userId,
        'isDeleted': true,
        'deleteWithAlbum': false
      }
      dbo.collection('images').find(whereStr).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(201)
          response.send('没有删除照片')
        } else {
          result.forEach(item => {
            let imageData = 'data:image/jpeg;base64,'
            imageData = imageData + fs.readFileSync(`${item.imageSrc}`, 'base64')
            returnImages.unshift({
              'imageId': item._id,
              'imageName': item.imageName,
              'imageData': imageData,
              'description': item.description,
              'filmingLocation': item.filmingLocation,
              'imageSrc': item.imageSrc
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