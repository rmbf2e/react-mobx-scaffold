import EventEmitter from 'events'
import { toJS, action, runInAction } from 'mobx'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'
import storeProp from 'share/storeProp'
import api from 'app/api'

const defaultSite = {
  name: '',
  fullName: '',
}

@storeProp({
  modal: [
    {
      name: 'form',
    },
  ],
  list: {
    name: 'sites',
    url: api.sites,
    rowKey: 'siteId',
    rowSelectionKey: 'siteId',
  },
  rest: [
    {
      name: 'site',
      default: defaultSite,
      create: {
        url: api.siteCreate,
      },
      destroy: {
        url: api.siteDestroy,
      },
      update: {
        url: api.siteUpdate,
      },
      fetch: {
        url: api.site,
      },
    },
  ],
})
class Site extends EventEmitter {
  // 关闭modal且还原表单数据
  @action
  hideForm = () => {
    this.site = defaultSite
    this.hideFormModal()
  }
}

const site = new Site()

site.on('site:created', res => {
  runInAction(() => {
    site.sites.tableProps.dataSource.push(res.data)
  })
})

site.on('site:destroyed', res => {
  runInAction(() => {
    const list = toJS(site.sites.tableProps.dataSource)
    remove(list, record => res.data.includes(record.siteId))
    site.sites.tableProps.dataSource = list
  })
})

site.on('site:updated', res => {
  runInAction(() => {
    const list = toJS(site.sites.tableProps.dataSource)
    const index = findIndex(list, r => r.siteId === res.data.siteId)
    list[index] = res.data
    site.sites.tableProps.dataSource = list
  })
})

export default site
