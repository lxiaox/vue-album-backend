module.exports = function (server, fs, MongoClient, url, ObjectID) {
  server.post('/editAlbum', (request, response) => {
    let userId = request.body.userId
    let albumId = request.body.albumId
    let albumName = request.body.albumName
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection(userId).find({ 'albumName': albumName }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() !== '' && result[0]._id != albumId) {
          response.status(400)
          response.send('相册名称不可重复')
        } else {
          // 写入cover.png
          let cover = request.body.cover
          if (cover) {
            let imgData = request.body.cover.replace(/^data:image\/\w+;base64,/, '')
            let dataBuffer = new Buffer(imgData, 'base64')
            fs.writeFileSync(`./db1/albums/${userId}/${albumId}/cover/cover.png`, dataBuffer)
          }
          // 更新db数据
          var whereStr = { "_id": ObjectID(albumId) };  // 查询条件
          var updateStr = {
            $set: {
              'albumName': request.body.albumName,
              'description': request.body.description,
              'classification': request.body.classification,
            }
          };
          dbo.collection(userId).updateOne(whereStr, updateStr, function (err, res) {
            if (err) throw err;
            console.log("编辑相册成功");
            response.sendStatus(200)
            db.close();
          });
        }
      })
    })
  })
}
