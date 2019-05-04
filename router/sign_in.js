// 登录
module.exports = function (server,fs) {
  server.post('/sign_in', (request, response) => {
    // 1取到user，users
    let user = request.body

    let users = fs.readFileSync('./db/users', 'utf8')
    try {
      users = JSON.parse(users)
    } catch (exception) {
      users = []
    }
    // 进行比较name pass
    let found = false,
      match = false
    for (let i = 0; i < users.length; i++) {
      if (user.userName === users[i]['userName']) {
        found = true
        if (user.password === users[i]['userName']) {
          match = true
        }
      }
    }
    if (found && match) {
      response.status(200)
      response.send('登录成功')
    } else if (found && !match) {
      response.status(404)
      response.send('密码错误')
    } else {
      response.status(404)
      response.send('用户不存在')
    }
  })
}