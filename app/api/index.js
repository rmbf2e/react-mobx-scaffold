// import reduce from 'lodash/reduce'

// 不带site部分的api
const api = {
  me: 'user/me',
  logout: 'user/logout',

  users: 'users',
  userCreate: 'userCreate',
  user: 'user/:id',

  // 角色部分api
  roles: 'roles',
  rolesAll: 'roles/all',
  role: 'role/:id',
  roleDestroy: 'roleDestroy',
  roleCreate: 'roleCreate',
  roleUpdate: 'roleUpdate',

  // 站点部分api
  sites: 'sites',
  siteCreate: 'siteCreate',
  siteUpdate: 'siteUpdate',
  siteDestroy: 'siteDestroy',
  site: 'site/:id',
}

export default api
