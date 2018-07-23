module.exports = {
  baseURL: '/api/',
  pageSize: 20,
  loginHost: `${process.env.LOGIN_HOST === 'test' ? 'http' : 'https'}://${
    process.env.LOGIN_HOST === 'test' ? 'test.' : ''
  }ssa.jd.com/sso/login`,
  pageSizeOptions: ['20', '30', '50'],

  // sider默认折叠
  siderCollapsed: false,
}
