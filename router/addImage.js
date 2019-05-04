module.exports = function (server,fs) {
  server.post('/addImage', (request, response) => {
    let userName = request.body.userName
    let albumName = request.body.albumName
    let img = request.body.img
    let albums = fs.readFileSync(`./db/albums/${userName}`, 'utf8')
    try {
      albums = JSON.parse(albums)
    } catch (exception) {
      albums = []
    }
    albums.forEach(ele => {
      if(ele.name === albumName){
        ele.imgs.unshift(img)
      }
    });
    albums = JSON.stringify(albums)
    fs.writeFileSync(`./db/albums/${userName}`, albums)
    response.sendStatus(200)
  })
}