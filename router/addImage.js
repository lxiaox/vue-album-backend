module.exports = function (server,fs) {
  server.post('/addImage', (request, response) => {
    let userName = request.body.userName
    let albumName = request.body.albumName
    let img = request.body.img
    
    let imgData = img.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = new Buffer(imgData, 'base64')
    let imgName = Date.now() + '.png'
    // 存图片
    fs.writeFileSync(`./db/albums/${userName}/${albumName}/images/${imgName}`, dataBuffer)
    // allImage记录
    let imgs = fs.readFileSync(`./db/albums/${userName}/${albumName}/images/allImage`)
    imgs = JSON.parse(imgs)
    imgs.unshift({'imageName':imgName})
    imgs = JSON.stringify(imgs)
    fs.writeFileSync(`./db/albums/${userName}/${albumName}/images/allImage`, imgs)
    response.sendStatus(200)
  })
}