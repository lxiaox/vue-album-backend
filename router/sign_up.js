// 注册
module.exports = function (server,fs) {
  server.post('/sign_up', (request, response) => {
    let user = request.body
    let users = fs.readFileSync('./db/users', 'utf8')
    try {
      users = JSON.parse(users)
    } catch (exception) {
      users = []
    }
    let inUse = false
    for (let i = 0; i < users.length; i++) {
      if (user.userName === users[i]['userName']) {
        inUse = true
      }
    }
    if (inUse) {
      response.status(400)
      response.send('用户名被占用')
    } else {
      // 1.users记录 2.albums下建一个文件夹 3.alblms/username/建一个allAlbum文件
      users.push(user)
      let usersString = JSON.stringify(users)
      fs.writeFileSync('./db/users', usersString)
      fs.mkdirSync(`./db/albums/${user.userName}`)
      fs.writeFileSync(`./db/albums/${user.userName}/allAlbum`, '[]')
      response.sendStatus(200)
    }
  })
}