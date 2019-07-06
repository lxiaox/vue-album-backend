// 删除相册
module.exports = function (server, fs, MongoClient, url, dateTime, ObjectID) {
  server.post('/deleteAlbum', (request, response) => {
    let albumId = request.body.albumId
    var dt = dateTime.create();
    var deleteDate = dt.format('Y-m-d');
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(albumId) }
      var updateStr = {
        $set: {
          'isDeleted': true,
          'deleteDate': deleteDate,
        }
      }
      var updateStr2 = {
        $set: {
          'isDeleted': true,
          'deleteDate': deleteDate,
          'deleteWithAlbum': true
        }
      };
      dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("删除相册成功");
        response.sendStatus(200)
        dbo.collection('images').updateMany({ 'albumId': albumId, 'isDeleted': false }, updateStr2, function (err, res) {
          if (err) throw err;
          dbo.collection('uploads').updateMany({ 'albumId': albumId, 'isDeleted': false }, updateStr2, function (err, res) {
            if (err) throw err;
            db.close()
          });
        });
      });
    })
  })
}
