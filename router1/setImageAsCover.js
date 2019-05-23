module.exports = function (server, fs, MongoClient, url, dateTime, ObjectID) {
  server.post('/setImageAsCover', (request, response) => {
    let albumId = request.body.albumId
    let coverSrc = request.body.imageSrc
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(albumId) }
      var updateStr = {
        $set: {
          'coverSrc': coverSrc,
        }
      };
      dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("设置图片为封面成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
