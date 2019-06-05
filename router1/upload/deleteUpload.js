module.exports = function (server, fs, MongoClient, url, dateTime, ObjectID) {
  server.post('/deleteUpload', (request, response) => {
    let uploadId = request.body.uploadId
    var dt = dateTime.create();
    var deleteDate = dt.format('Y-m-d');
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(uploadId) }
      var updateStr = {
        $set: {
          'isDeleted': true,
          'deleteDate': deleteDate,
          'deleteWithAlbum': false
        }
      };
      dbo.collection('uploads').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log('删除上传记录成功')
        response.sendStatus(200)
        db.close()
      });
    })
  })
}
