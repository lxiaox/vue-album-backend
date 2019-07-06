// 上传照片或视频
module.exports = function (server, fs, MongoClient, url, dateTime, ObjectID) {
  server.post('/addImage', (request, response) => {
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      // 按日期命名
      var dt = dateTime.create();
      var imageName = dt.format('Y-m-d');
      var imageSaveName = dt.format('Y-m-d-H-M-S-MS-NS');
      let saveSrc = ''
      let imgData
      // 存图片
      if (!request.body.isVideo) {
        saveSrc = `./db1/albums/images/${imageSaveName}.png`
        imgData = request.body.image.replace(/^data:image\/\w+;base64,/, '')
      }
      if (request.body.isVideo) {
        saveSrc = `./db1/albums/images/${imageSaveName}.mp4`
        imgData = request.body.image.replace(/^data:video\/\w+;base64,/, '')
      }
      let dataBuffer = new Buffer(imgData, 'base64')
      fs.writeFileSync(saveSrc, dataBuffer)

      // 存db
      let imageObj = {
        userId: request.body.userId,
        albumId: albumId,
        isDeleted: false,
        imageSrc: saveSrc,
        isVideo: request.body.isVideo,
        imageName: imageName,// 可变
        imageSaveName: imageSaveName,// 不可变
        uploadId: request.body.uploadId
      }
      dbo.collection('images').insertOne(imageObj, function (err, res) {
        if (err) throw err;
        if (res.result.ok === 0) {
          response.sendStatus(500)
          db.close()
          return
        }
        dbo.collection('albums').find({ _id: ObjectID(albumId) })
          .toArray(function (err, result) {
            if (err) throw err;
            let counts = result[0].imageCounts + 1
            var whereStr = { "_id": ObjectID(albumId) };
            var updateStr = {
              $set: {
                'imageCounts': counts
              }
            };
            dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
              if (err) throw err;
              if (res.result.ok === 0) {
                response.sendStatus(500)
                db.close()
                return
              }
              console.log("保存上传图片成功");
              response.sendStatus(200)
              db.close()
            })
          })
      });
    })
  })
}
