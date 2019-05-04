module.exports = function (server,fs) {
  // 获取相册
  server.get('/getAlbums', (request, response) => {
    let userName = request.query.userName
    let albums = fs.readFileSync(`./db/albums/${userName}`, 'utf8')
    try {
      albums = JSON.parse(albums)
    } catch (exception) {
      albums = []
    }
    response.status(200)
    response.send(albums)
  });
}