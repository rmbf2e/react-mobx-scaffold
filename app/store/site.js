import EventEmitter from 'events'
import { action } from 'mobx'
import storeProp from 'app/storeProp'
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
    name: 'site',
    url: api.sites,
    rowKey: 'siteId',
    rowSelectionKey: 'siteId',
  },
  rest: [
    {
      name: 'site',
      default: defaultSite,
      create: {
        url: api.sites,
      },
      destroy: {
        url: api.sites,
      },
      update: {
        url: api.site,
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

site.on('site:changed', () => {
  site.fetchSites()
})

export default site
