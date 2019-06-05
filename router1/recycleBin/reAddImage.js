module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/reAddImage', (request, response) => {
    let imageId = request.body.imageId
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(imageId) }
      var updateStr = {
        $set: {
          'albumId': albumId,
          'isDeleted': false,
        }
      }
      dbo.collection('images').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        response.sendStatus(200)
        // 相册图片数量加一
        dbo.collection('albums').find({ _id: ObjectID(albumId) }).toArray(function (err, result) {
          if (err) throw err;
          let counts = result[0].imageCounts + 1
          var whereStr1 = { "_id": ObjectID(albumId) };
          var updateStr1 = {
            $set: {
              'imageCounts': counts
            }
          };
          dbo.collection('albums').updateOne(whereStr1, updateStr1, function (err, res) {
            if (err) throw err;
            db.close()
          })
        })
      })
    })
  })
}
