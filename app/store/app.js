import fxios from 'util/fxios'
import ShareAppStore from 'share/store/app'
import api from 'app/api'

class App extends ShareAppStore {
  // 获取当前登录用户后，获取网站必须元数据
  load = () => this.fetchMe()

  fetchMe = () => fxios.get(api.me).then(res => {
      this.setMe(res.data)
    })

  logout = () => fxios.get(api.logout)
}

export default new App()
