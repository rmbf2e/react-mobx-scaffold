import EventEmitter from 'events'
import storeProp from 'app/storeProp'
import fxios from 'tool/fxios'
import api from 'app/api'

@storeProp({
  setter: [
    {
      name: 'me',
      default: {},
    },
    {
      name: 'loading',
      default: true,
    },
  ],
})
class App extends EventEmitter {
  load = () => this.fetchMe().finally(() => this.setLoading(false))

  fetchMe = () =>
    fxios.get(api.me).then(res => {
      this.setMe(res.data)
    })

  logout = () => fxios.get(api.logout)

  logout = () => {
    throw new Error('根据每个项目接口不同，实现自己的logout方法')
  }
}

export default new App()
