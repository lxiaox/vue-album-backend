module.exports = function (server, fs, MongoClient, url, ObjectID) {
  // 获取图片
  server.get('/getUploadsTree', (request, response) => {
    // 初始化
    let userId = request.query.userId
    let amount = Number(request.query.queryAmount)
    let count = Number(request.query.queryCount) * amount
    let returnImagesTree = []
    //查albumName
    function findAlbumName(album, dbo) {
      let albumId = ObjectID(album)
      return new Promise((resolve, reject) => {
        dbo.collection('albums').find({
          '_id': ObjectID(albumId),
        }).toArray(function (err, result) {
          if (err) throw err;
          let albumName = result[0].albumName
          resolve(albumName)
        })
      })
    }
    //查图片
    function findImages(number, dbo) {
      let uploadId = number.toString()
      return new Promise((resolve, reject) => {
        dbo.collection('images').find({
          'uploadId': uploadId,
          'isDeleted': false
        }).toArray(function (err, result) {
          if (err) throw err;
          if (result.length === 0) { reject() }
          else {
            result.forEach(item => {
              let img = 'data:image/jpeg;base64,'
              if (item.imageSrc && fs.existsSync(`${item.imageSrc}`)) {
                img = img + fs.readFileSync(`${item.imageSrc}`, 'base64')
              } else {
                img = ''
              }
              item.imageData = img
            })
            resolve(result)
          }
        })
      })
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereStr = {
        'userId': userId,
        'isDeleted': false
      }
      dbo.collection('uploads').find(whereStr)
        .sort({ '_id': -1 })
        .skip(count).limit(amount)
        .toArray(function (err, result) {
          if (err) throw err;
          if (result.toString() === '') {
            response.status(201)
            response.send('未添加任何照片')
            db.close()
          } else {
            let forCount = 0
            let length = result.length
            //对结果进行循环，每一个：查albumName，查该次上传所有图片，push这个结果
            function getResult(item) {
              let treeObj = {
                uploadId: item._id,
                albumId: item.albumId,
                uploadDate: item.uploadDate
              }
              //查albumName
              findAlbumName(item.albumId, dbo).then(value => {
                treeObj.albumName = value
              }).then(value => {
                //查图片
                findImages(item._id, dbo).then(value => {
                  treeObj.imagesArr = value
                  returnImagesTree.push(treeObj)
                  forCount = forCount + 1
                  if (forCount === length) {
                    response.status(200)
                    response.send(returnImagesTree)
                    db.close()
                  } else {
                    getResult(result[forCount])
                  }
                }, err => {
                  forCount = forCount + 1
                  if (forCount === length) {
                    response.status(200)
                    response.send(returnImagesTree)
                    db.close()
                  } else {
                    getResult(result[forCount])
                  }
                })
              }, err => {

              })
            }
            getResult(result[0])
          }
        })
    })
  })
}
