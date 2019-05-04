module.exports = function (server,fs) {
  // 获取相册图片
  server.get('/getImagesByAlbumName', (request, response) => {
    let userName = request.query.userName
    let albumName = request.query.albumName
    let albums = fs.readFileSync(`./db/albums/${userName}`, 'utf8')
    let images = []
    try {
      albums = JSON.parse(albums)
    } catch (exception) {
      albums = []
    }
    albums.forEach(ele => {
      if (ele.name === albumName) {
        images = ele.imgs
      }
    });
    response.status(200)
    response.send(images)
  })
}