module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 布局展示 获取所有图片（图数据）
  server.get('/getImagesData', (request, response) => {
    let userId = request.query.userId
    let returnImages = []
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereStr = {
        'userId': userId,
        'isDeleted': false
      }
      dbo.collection('images').find(whereStr).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() === '') {
          response.status(201)
          response.send('未添加任何照片')
        } else {
          result.forEach(item => {
            let imageData = 'data:image/jpeg;base64,'
            if (item.imageSrc && fs.existsSync(`${item.imageSrc}`)) {
              imageData = imageData + fs.readFileSync(`${item.imageSrc}`, 'base64')
            } else {
              imageData = ''
            }
            returnImages.unshift({
              'imageData': imageData,
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