module.exports = function (server, fs, MongoClient, url, dateTime) {
  server.get('/addUpload', (request, response) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      // 按日期命名
      var dt = dateTime.create();
      var uploadDate = dt.format('Y-m-d');
      let uploadObj = {
        albumId: request.query.albumId,
        userId: request.query.userId,
        uploadCounts: request.query.uploadCounts,
        uploadDate: uploadDate,
        isDeleted: false,
      }
      dbo.collection('uploads').insertOne(uploadObj, function (err, res) {
        if (err) throw err;
        response.status(200)
        response.send(res.insertedId)
        db.close();
      });
    })
  })
}
