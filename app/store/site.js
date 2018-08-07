import EventEmitter from 'events'
import { action, runInAction } from 'mobx'
// import remove from 'lodash/remove'
// import findIndex from 'lodash/findIndex'
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
  const ids = res.data
  ids.forEach(id => {
    const list = site.sites.tableProps.dataSource
    const record = list.find(r => r.siteId === id)
    runInAction(() => {
      list.remove(record)
    })
  })
})

site.on(
  'site:updated',
  action('siteUpdated', res => {
    const list = site.sites.tableProps.dataSource
    const index = list.findIndex(r => r.siteId === res.data.siteId)
    list[index] = {
      ...res.data,
      className: 'animated flash',
    }
    setTimeout(() => {
      runInAction(() => {
        list[index].className = ''
      })
    }, 1000)
  }),
)

export default site
