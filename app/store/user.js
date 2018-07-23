import storeProp from 'app/storeProp'
import { observable, action } from 'mobx'
import api from 'app/api'
import { GENDER } from 'app/constant'
import fxios from 'util/fxios'

const defaultUser = {
  erp: '',
  name: '',
  sex: GENDER[0].value,
  mail: '',
  mobile: '',
  roles: [],
  userType: '',
}

@storeProp({
  list: [
    {
      name: 'user',
      url: api.users,
      rowKey: 'userId',
      rowSelectionKey: 'userId',
    },
  ],
  modal: ['form', 'import', 'batchEdit', 'category'],
  crud: [
    {
      name: 'me',
      default: {},
      fetch: {
        url: api.me,
      },
    },
    {
      name: 'user',
      default: defaultUser,
      create: {
        url: api.users,
      },
      update: {
        url: api.user,
      },
      fetch: {
        url: api.user,
      },
      destroy: {
        url: api.user,
      },
    },
  ],
})
// axios无法处理返回302的redirect状态，所以还是用fetch
// https://blog.csdn.net/orangleliu/article/details/79862248
// https://github.com/axios/axios/issues/980
// axios的maxRedirects: 0只在nodejs端有用，浏览器没用
class User {
  currentType = null
  @observable.shallow ALL_ROLES = []
  @observable fetchingRoles = false

  logout = () => fxios.get(api.logout)

  @action
  fetchAllRoles = () => {
    this.fetchingRoles = true
    return fxios
      .get(api.rolesAll)
      .then(action('setAllRoles', res => {
          this.ALL_ROLES = res.data.map(r => ({
            label: r.fullName,
            value: String(r.roleId),
          }))
        }))
      .finally(action('setFetchingRoles', () => {
          this.fetchingRoles = false
        }))
  }

  // 关闭modal且将role还原
  @action
  hideForm = () => {
    this.user = defaultUser
    this.hideFormModal()
  }

  @action
  setRoleAndShowFormModal = role => {
    this.user.roles = [role]
    this.showFormModal()
  }

  // 批量导入用户
  @observable importingUsers = false
  @action
  importUsers = data => {
    this.importingUsers = true
    return fxios.post(api.userImport, data).finally(action('setImportingUsers', () => {
        this.importingUsers = false
      }))
  }

  // 根据帐号查询对应信息自动填充表单
  // searchByAccount = (user, type) =>
  //   fxios.get(api.userSearchByAccount, { user, type })
}

export default new User()
