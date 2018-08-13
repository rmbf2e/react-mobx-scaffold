import EventEmitter from 'events'
import { action, runInAction } from 'mobx'
import storeProp from 'share/storeProp'
import api from 'app/api'
import { ROLE_STATUS } from 'app/constant'

const defaultRole = {
  name: '',
  fullName: '',
  status: ROLE_STATUS[0].value,
  roleType: '',
}

@storeProp({
  modal: [
    {
      name: 'form',
    },
  ],
  rest: [
    {
      name: 'role',
      default: defaultRole,
      create: {
        url: api.roleCreate,
      },
      destroy: {
        url: api.roleDestroy,
      },
      update: {
        url: api.roleUpdate,
      },
      fetch: {
        url: api.role,
      },
    },
  ],
  list: {
    name: 'roles',
    url: api.roles,
    rowKey: 'roleId',
    rowSelectionKey: 'roleId',
  },
})
class Role extends EventEmitter {
  // 关闭modal且将role还原
  @action
  hideForm = () => {
    this.role = defaultRole
    this.hideFormModal()
  }
}

const role = new Role()

role.on('role:destroyed', res => {
  const ids = res.data
  ids.forEach(id => {
    const list = role.roles.tableProps.dataSource
    const record = list.find(r => r.roleId === id)
    runInAction(() => {
      list.remove(record)
    })
  })
})

role.on('role:created', res => {
  runInAction(() => {
    role.roles.tableProps.dataSource.push(res.data)
  })
})

role.on(
  'role:updated',
  action('siteUpdated', res => {
    const list = role.roles.tableProps.dataSource
    const index = list.findIndex(r => r.roleId === res.data.roleId)
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
export default role
