// import reduce from 'lodash/reduce'

// 不带site部分的api
const api = {
  me: 'user/me',
  logout: 'user/logout',

  users: 'users',
  user: 'user/:id',

  // 角色部分api
  roles: 'roles',
  rolesAll: 'roles/all',
  role: 'role/:id',

  // 站点部分api
  sites: 'sites',
  site: 'site/:id',
}

export default api
