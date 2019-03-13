import { base as api } from 'src/api'
import { extendStore } from 'src/extendStore'
import { fxios } from 'tool/fxios'

interface IUser {
  name: string
  erp: string
  email: string
}

abstract class AppClass {
  public me: IUser
  public fetchMe: (v?: any) => Promise<any>

  public loading: boolean
  public setLoading: (v: boolean) => void
  public restoreLoading: () => void
}

@extendStore({
  rest: [
    {
      name: 'me',
      default: {},
      fetch: {
        url: api.me,
      },
    },
  ],
  setter: [
    {
      name: 'loading',
      default: true,
    },
  ],
})
export class App extends AppClass {
  public load = () => this.fetchMe().finally(() => this.setLoading(false))

  public logout = () => fxios.get(api.logout)
}

export const app = new App()
