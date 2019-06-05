module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/editAlbum', (request, response) => {
    let albumId = request.body.albumId
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      // 写入cover.png
      let cover = request.body.cover
      if (cover) {
        let imgData = cover.replace(/^data:image\/\w+;base64,/, '')
        let dataBuffer = new Buffer(imgData, 'base64')
        fs.writeFileSync(`./db1/albums/covers/cover_${albumId}.png`, dataBuffer)
      }
      // 更新db数据
      var whereStr = { "_id": ObjectID(albumId) };  // 查询条件
      var updateStr = {
        $set: {
          'albumName': request.body.albumName,
          'description': request.body.description,
          'classification': request.body.classification,
          'coverSrc': `./db1/albums/covers/cover_${albumId}.png`
        }
      };
      dbo.collection('albums').updateOne(whereStr, updateStr, function (err, res) {
        if (err) throw err;
        console.log("编辑相册成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
