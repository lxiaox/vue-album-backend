module.exports = function (server, fs) {
  // 获取相册图片
  server.get('/getImages', (request, response) => {
    let userName = request.query.userName
    let albumName = request.query.albumName
    let images = []
    let files = fs.readFileSync(`./db/albums/${userName}/${albumName}/images/allImage`)
    files = JSON.parse(files)
    files.forEach(item => {
      let imgSrc = 'data:image/jpeg;base64,' + fs.readFileSync(`./db/albums/${userName}/${albumName}/images/${item.imageName}`, 'base64')
      images.push({
        'imageName': item.imageName,
        'imageSrc': imgSrc
      })
    })
    response.status(200)
    response.send(images)
  })
}