import Events from 'events'
import { observe } from 'mobx'
import storeProp from 'app/storeProp'
import searchForm from 'store/searchForm'
import { user as api } from 'app/api'
import { GENDER } from 'app/constant'

const defaultRecord = {
  account: '',
  name: '',
  sex: GENDER[0].value,
  mail: '',
  mobile: '',
}

@storeProp({
  list: [
    {
      name: 'list',
      url: api.list,
      rowKey: 'id',
      rowSelectionKey: 'id',
    },
  ],
  modal: ['form'],
  rest: [
    {
      name: 'record',
      default: defaultRecord,
      create: {
        url: api.create,
      },
      update: {
        url: api.detail,
      },
      fetch: {
        url: api.detail,
      },
      destroy: {
        url: api.list,
      },
    },
  ],
})
class User extends Events {}

const store = new User()

// 关闭modal且将record还原
observe(store, 'formModal', ({ newValue }) => {
  if (!newValue) {
    store.restoreRecord()
  }
})

store.on('record:changed', () => {
  store.list.search = searchForm.query
  store.fetchList()
})

export default store
