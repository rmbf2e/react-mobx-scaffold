import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import appZhCN from 'src/zh_CN'
import appEnUS from 'src/en_US'
import storeProp from 'src/storeProp'

Object.assign(zhCN, appZhCN)
Object.assign(enUS, appEnUS)

@storeProp({
  setter: [
    {
      name: 'lang',
      default: zhCN,
      shallow: true,
    },
  ],
})
class Locale {}

const store = new Locale()

export default store
