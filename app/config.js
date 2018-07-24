module.exports = {
  baseURL: '/api/', // 后端接口前缀，必须有，开发环境通过webpackDevServer转换，生产环境通过nginx转换。实际后端接口不需要有该前缀
  pageSize: 20,
  loginHost: `${process.env.LOGIN_HOST === 'test' ? 'http' : 'https'}://${
    process.env.LOGIN_HOST === 'test' ? 'test.' : ''
  }ssa.jd.com/sso/login`,
  pageSizeOptions: ['20', '30', '50'],

  // sider默认折叠
  siderCollapsed: false,
}
