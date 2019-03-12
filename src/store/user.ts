import Events from 'events'
import { observe } from 'mobx'
import { user as api } from 'src/api'
import { GENDER } from 'src/constant'
import extendStore from 'src/extendStore'
import queryForm from 'store/queryForm'

const defaultRecord = {
  account: '',
  name: '',
  gender: GENDER[0].value,
  mail: '',
  mobile: '',
}

abstract class AStore extends Events {
  public formModal: boolean
  public restoreRecord: () => void

  public setListSearch: (v: any) => void
  public fetchList: () => Promise<any>
}

@extendStore({
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
class User extends AStore {}

export const user = new User()

// 关闭modal且将record还原
observe(user, 'formModal', ({ newValue }) => {
  if (!newValue) {
    user.restoreRecord()
  }
})

user.on('record:changed', () => {
  user.setListSearch(queryForm.query)
  user.fetchList()
})
