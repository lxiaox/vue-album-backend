module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/clearAlbum', (request, response) => {
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")

      dbo.collection('albums').deleteOne({ '_id': ObjectID(albumId) }, function (err, res) {
        if (err) throw err;
        // 查找相册中照片文件路径
        let whereImages = {
          'albumId': albumId, 'isDeleted': true, 'deleteWithAlbum': true
        }
        dbo.collection('images').find(whereImages).toArray(function (err, result) {
          if (err) throw err;
          if (result.length === 0) {
            response.sendStatus(200)
            console.log('清除相册成功')
            db.close()
            return
          }
          // 删除照片文件
          result.forEach(item => {
            fs.unlinkSync(item.imageSrc)
          });
          dbo.collection('images').deleteMany(whereImages, function (err, res) {
            if (err) throw err;
            console.log(res.result.n + " 张照片被删除");
            response.sendStatus(200)
            console.log('清除相册成功')
            db.close();
          });
        });
      });
    })
  })
}
