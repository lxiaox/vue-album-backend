// 创建相册
module.exports = function (server, fs, MongoClient, url) {
  server.post('/addAlbum', (request, response) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      let albumObj = {
        albumName: request.body.albumName,
        userId: request.body.userId,
        description: request.body.description,
        classification: request.body.classification,
        isDeleted: false,
        imageCounts: 0,
        coverSrc: ''
      }
      dbo.collection('albums').insertOne(albumObj, function (err, res) {
        if (err) throw err;
        console.log("相册信息插入成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
