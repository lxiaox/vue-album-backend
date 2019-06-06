module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/clearImage', (request, response) => {
    let imageId = request.body.imageId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let whereImage = { '_id': ObjectID(imageId) }
      // 查找照片文件路径
      dbo.collection('images').find(whereImage).toArray(function (err, result) {
        if (err) throw err;
        fs.unlinkSync(result[0].imageSrc)
        dbo.collection('images').deleteOne(whereImage, function (err, res) {
          if (err) throw err;
          console.log(res.result.n + " 张照片被删除");
          response.sendStatus(200)
          db.close();
        });
      });
    })
  })
}
