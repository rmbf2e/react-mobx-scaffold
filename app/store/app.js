import user from 'store/user'

class App {
  // 获取当前登录用户后，获取网站必须元数据等
  load = () => user.fetchMe().then(user.fetchAllRoles)
}

export default new App()
