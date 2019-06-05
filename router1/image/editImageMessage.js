module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/editImageMessage', (request, response) => {
    let image = request.body.image
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      var whereStr = { "_id": ObjectID(image.imageId) };  // 查询条件
      var updateStr = {
        $set: {
          'imageName': image.imageName,
          'description': image.description,
          'filmingLocation': image.filmingLocation,
        }
      };
      dbo.collection('images').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("编辑照片信息成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
