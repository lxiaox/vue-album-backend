module.exports = function (server,fs) {
  server.post('/addAlbum', (request, response) => {
    let userName = request.body.userName
    let albumName = request.body.name
    let albumCover = request.body.cover
    let albums = fs.readFileSync(`./db/albums/${userName}`, 'utf8')
    try {
      albums = JSON.parse(albums)
    } catch (exception) {
      albums = []
    }
    albums.unshift({name: albumName,cover: albumCover,imgs: []})
    albums = JSON.stringify(albums)
    fs.writeFileSync(`./db/albums/${userName}`, albums)
    response.sendStatus(200)
  })
}