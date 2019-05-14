module.exports = function (server, fs, MongoClient, url) {
  server.post('/addAlbum', (request, response) => {
    let userName = request.body.userName
    let albumName = request.body.albumName
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err
      let dbo = db.db("AlbumDB")
      dbo.collection(userName).find({ 'albumName': albumName }).toArray(function (err, result) {
        if (err) throw err;
        if (result.toString() !== '') {
          response.status(400)
          response.send('相册名称不可重复')
        } else {
          if (!fs.existsSync(`./db1/albums/${userName}/${albumName}`)) {
            fs.mkdirSync(`./db1/albums/${userName}/${albumName}`)
          }
          if (!fs.existsSync(`./db1/albums/${userName}/${albumName}/images`)) {
            fs.mkdirSync(`./db1/albums/${userName}/${albumName}/images`)
          }
          if (!fs.existsSync(`./db1/albums/${userName}/${albumName}/cover`)) {
            fs.mkdirSync(`./db1/albums/${userName}/${albumName}/cover`)
          }
          let albumObj = {
            albumName: request.body.albumName,
            description: request.body.description,
            classification: request.body.classification,
            isDeleted: false,
            imageCounts: 0,
            imagesSrc: `./db1/albums/${userName}/${albumName}/images`,
            coverSrc: `./db1/albums/${userName}/${albumName}/cover/cover.png`,
          }
          dbo.collection(userName).insertOne(albumObj, function (err, res) {
            if (err) throw err;
            console.log("文档插入成功");
            response.sendStatus(200)
            db.close();
          });
        }
      })
    })
  })
}
