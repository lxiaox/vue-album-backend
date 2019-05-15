module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/deleteAlbum', (request, response) => {
    let userId = request.body.userId
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(albumId) }
      var updateStr = {
        $set: {
          'isDeleted': true
        }
      };
      dbo.collection(userId).updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("删除相册成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
