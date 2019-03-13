import en_US from 'antd/lib/locale-provider/en_US'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import appEnUS from 'locale/en_US'
import { ILang } from 'locale/interface'
import appZhCN from 'locale/zh_CN'
import { extendStore } from 'src/extendStore'
import { TNoop } from 'store/interface'

abstract class ALocale {
  public setLang: (v: ILang) => void
  public lang: ILang
  public restoreLang: TNoop
  public langs: ILangs
}

// merge antd language with app language
export const zhCN = { ...zh_CN, ...appZhCN }
export const enUS = { ...en_US, ...appEnUS }

export interface ILangs {
  zhCN: ILang
  enUS: ILang
}

type Tlanguage = keyof ILangs

@extendStore({
  setter: [
    {
      name: 'lang',
      default: zhCN,
      shallow: true,
    },
  ],
})
export class Locale extends ALocale {
  public setLang: (v: ILang) => void

  public langs = {
    zhCN,
    enUS,
  }

  public super: any
  constructor() {
    super()
    const languageName: Tlanguage = navigator.language.replace(
      '-',
      '',
    ) as Tlanguage
    const lang: ILang = this.langs[languageName]
    if (lang) {
      // 此时还没有setLang函数，下一个事件循环中才有
      setTimeout(() => {
        this.setLang(lang)
      })
    }
  }
}

export const locale = new Locale()
