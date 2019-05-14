module.exports = function (server,fs) {
  server.post('/addAlbum', (request, response) => {
    let userName = request.body.userName
    let albumName = request.body.albumName
    
    if (inUse) {
      response.status(400)
      response.send('相册名称不可重复')
    } else {
    // allAlbum记录
    albums.unshift({'albumName': albumName})
    albums = JSON.stringify(albums)
    fs.writeFileSync(`./db/albums/${userName}/allAlbum`, albums)
    // 新建albumName/cover+images+images/allImage
    let coverData = albumCover.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = new Buffer(coverData, 'base64')
    fs.mkdirSync(`./db/albums/${userName}/${albumName}`)
    fs.mkdirSync(`./db/albums/${userName}/${albumName}/images`)
    fs.writeFileSync(`./db/albums/${userName}/${albumName}/images/allImage`, '[]')
    fs.writeFileSync(`./db/albums/${userName}/${albumName}/cover.png`, dataBuffer)

    response.sendStatus(200)
  }
})
}
