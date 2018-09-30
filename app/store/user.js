import Events from 'events'
import { observe } from 'mobx'
import storeProp from 'app/storeProp'
import api from 'app/api'
import { GENDER, USER_STATUS } from 'app/constant'

const defaultRecord = {
  erp: '',
  name: '',
  sex: GENDER[0].value,
  mail: '',
  mobile: '',
  status: USER_STATUS[0].value,
  roles: [],
  userType: '',
}

@storeProp({
  list: [
    {
      name: 'list',
      url: api.users,
      rowKey: 'userId',
      rowSelectionKey: 'userId',
    },
  ],
  modal: ['form'],
  rest: [
    {
      name: 'me',
      default: {},
      fetch: {
        url: api.me,
      },
    },
    {
      name: 'record',
      default: defaultRecord,
      create: {
        url: api.userCreate,
      },
      update: {
        url: api.user,
      },
      fetch: {
        url: api.user,
      },
      destroy: {
        url: api.users,
      },
    },
  ],
})
class User extends Events {}

const store = new User()

// 关闭modal且将role还原
observe(store, 'formModal', ({ newValue }) => {
  if (!newValue) {
    store.restoreRecord()
  }
})

export default store
