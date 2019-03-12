import zhCN from 'antd/lib/locale-provider/zh_CN'

interface ILangApp {
  language: string
  locale: string
  QueryForm: {
    search: string
  }
  ConfirmButton: {
    confirm: string
  }
  Loading: {
    loading: string
  }
  Header: {
    title: string
    language: string
    logout: string
  }
  Theme: {
    turnOn: string
    turnOff: string
  }
}

export type ILang = ILangApp & typeof zhCN
