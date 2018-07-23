import { action } from 'mobx'
import storeProp from 'app/storeProp'
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
  crud: [
    {
      name: 'role',
      default: defaultRole,
      create: {
        url: api.roles,
      },
      destroy: {
        url: api.role,
      },
      update: {
        url: api.role,
      },
      fetch: {
        url: api.role,
      },
    },
  ],
  list: {
    name: 'role',
    url: api.roles,
    rowKey: 'roleId',
    rowSelectionKey: 'roleId',
  },
})
class Role {
  // 关闭modal且将role还原
  @action
  hideForm = () => {
    this.role = defaultRole
    this.hideFormModal()
  }
}

export default new Role()
