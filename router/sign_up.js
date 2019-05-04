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
      users.push(user)
      let usersString = JSON.stringify(users)
      fs.writeFileSync('./db/users', usersString)
      fs.writeFileSync(`./db/albums/${user.userName}`, '[]')
      response.sendStatus(200)
    }
  })
}