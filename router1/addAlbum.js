module.exports = function (server, fs, MongoClient, url) {
  server.post('/addAlbum', (request, response) => {
    let userId = request.body.userId
    let albumName = request.body.albumName
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection(userId).find({ 'albumName': albumName }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() !== '') {
          response.status(400)
          response.send('相册名称不可重复')
        } else {
          let albumObj = {
            albumName: request.body.albumName,
            description: request.body.description,
            classification: request.body.classification,
            isDeleted: false,
            imageCounts: 0,
          }
          dbo.collection(userId).insertOne(albumObj, function (err, res) {
            if (err) throw err;
            console.log("相册信息插入成功");
            let albumId = res.insertedId
            // 存fs
            if (!fs.existsSync(`./db1/albums/${userId}/${albumId}`)) {
              fs.mkdirSync(`./db1/albums/${userId}/${albumId}`)
            }
            if (!fs.existsSync(`./db1/albums/${userId}/${albumId}/cover`)) {
              fs.mkdirSync(`./db1/albums/${userId}/${albumId}/cover`)
            }
            // 存db路径
            var whereStr = { "_id": albumId };  // 查询条件
            var updateStr = {
              $set: {
                'coverSrc': `./db1/albums/${userId}/${albumId}/cover/cover.png`,
              }
            };
            dbo.collection(userId).updateOne(whereStr, updateStr, function (err, res) {
              if (err) throw err;
              console.log('创建相册成功')
              db.close();
              response.sendStatus(200)
            });
          });
        }
      })
    })
  })
}
