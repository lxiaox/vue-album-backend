module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // albumView 获取图片 （图片信息 + 图数据据）
  server.get('/getImages', (request, response) => {
    let userId = request.query.userId
    let albumId = request.query.albumId
    let returnImages = []
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereStr = {
        'userId': userId,
        'albumId': albumId,
        'isDeleted': false
      }
      dbo.collection('images').find(whereStr).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(201)
          response.send('未添加任何照片')
        } else {
          result.forEach(item => {
            let imageData = ''
            if(!item.isVideo){
              imageData = 'data:image/jpeg;base64,'
            }else{
              imageData = 'data:video/mp4;base64,'
            }
            if (item.imageSrc && fs.existsSync(`${item.imageSrc}`)) {
              imageData = imageData + fs.readFileSync(`${item.imageSrc}`, 'base64')
            } else {
              imageData = ''
            }
            returnImages.unshift({
              'imageId': item._id,
              'imageName': item.imageName,
              'imageData': imageData,
              'description': item.description,
              'filmingLocation': item.filmingLocation,
              'imageSrc': item.imageSrc,
              'isVideo': item.isVideo
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