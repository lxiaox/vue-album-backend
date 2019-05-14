module.exports = function (server,fs) {
  // 获取相册
  server.get('/getAlbums', (request, response) => {
    let userName = request.query.userName
    let returnAlbums = []
    // 读取allAlbum，按顺序排列
    let files = fs.readFileSync(`./db/albums/${userName}/allAlbum`)
    files = JSON.parse(files)
    files.forEach(item => {
      // 封面base解码
      let cover = 'data:image/jpeg;base64,' + fs.readFileSync(`./db/albums/${userName}/${item.albumName}/cover.png`, 'base64')
      returnAlbums.push({'albumName': item.albumName, 'cover': cover})
    });
    response.status(200)
    response.send(returnAlbums)
  });
}