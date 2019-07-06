// 回收相册
module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/reAddAlbum', (request, response) => {
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(albumId) }
      var updateStr = {
        $set: {
          'isDeleted': false,
        }
      }
      dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        response.sendStatus(200)
        var whereImage = {
          'albumId': albumId,
          'isDeleted': true,
          'deleteWithAlbum': true
        }
        var updateImage = {
          $set: {
            'isDeleted': false
          }
        }
        dbo.collection('images').updateMany(whereImage, updateImage, function (err, res) {
          if (err) throw err;
          dbo.collection('uploads').updateMany(whereImage, updateImage, function (err, res) {
            if (err) throw err;
            db.close()
          });
        });
      });
    })
  })
}
