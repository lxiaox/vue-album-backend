module.exports = function (server, fs, MongoClient, url, dateTime, ObjectID) {
  server.post('/deleteImage', (request, response) => {
    let imageId = request.body.imageId
    let albumId = request.body.albumId
    var dt = dateTime.create();
    var deleteDate = dt.format('Y-m-d');
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(imageId) }
      var updateStr = {
        $set: {
          'isDeleted': true,
          'deleteDate': deleteDate,
          'deleteWithAlbum': false
        }
      };
      dbo.collection('images').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("删除图片成功");
        response.sendStatus(200)
        // 相册图片数量减一
        dbo.collection('albums').find({ _id: ObjectID(albumId) })
          .toArray(function (err, result) {
            if (err) throw err;
            let counts = result[0].imageCounts - 1
            var whereStr = { "_id": ObjectID(albumId) };
            var updateStr = {
              $set: {
                'imageCounts': counts
              }
            };
            dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
              if (err) throw err;
              db.close()
            })
          })
      });
    })
  })
}
