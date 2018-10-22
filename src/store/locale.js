import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import appZhCN from 'locale/zh_CN'
import appEnUS from 'locale/en_US'
import storeProp from 'src/storeProp'

// merge antd language with app language
Object.assign(zhCN, appZhCN)
Object.assign(enUS, appEnUS)

@storeProp({
  setter: [
    {
      name: 'lang',
      default: enUS,
      shallow: true,
    },
  ],
})
class Locale {
  constructor() {
    const languageName = global.navigator.language.replace('-', '')
    const lang = { zhCN, enUS }[languageName]
    if (lang) {
      setTimeout(() => {
        this.setLang(lang)
      })
    }
  }

  langs = {
    zhCN,
    enUS,
  }
}

const store = new Locale()

export { Locale }

export default store
