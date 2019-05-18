module.exports = function (server, fs, MongoClient, url, dateTime) {
  server.post('/addImage', (request, response) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      // 按日期命名
      var dt = dateTime.create();
      var imageName = dt.format('Y-m-d');
      var imageSaveName = dt.format('Y-m-d-H-M-S-MS-NS');
      // 存图片
      let imgData = request.body.image.replace(/^data:image\/\w+;base64,/, '')
      let dataBuffer = new Buffer(imgData, 'base64')
      fs.writeFileSync(`./db1/albums/images/${imageSaveName}.png`, dataBuffer)
      // 存db
      let imageObj = {
        userId: request.body.userId,
        albumId: request.body.album.albumId,
        isDeleted: false,
        imageSrc: `./db1/albums/images/${imageSaveName}.png`,
        imageName: imageName,// 可变
        imageSaveName: imageSaveName// 不可变
      }
      dbo.collection('images').insertOne(imageObj, function (err, res) {
        if (err) throw err;
        console.log("保存上传图片成功");
        response.sendStatus(200)
        db.close();
      });
    })
  })
}
