// for test develop compoennt
// in real app you could extend this config for your app config
export default {
  title: 'my site',
  baseURL: '/api/',
  pageSize: 10,
  loginHost: `${process.env.LOGIN_HOST === 'test' ? 'http' : 'https'}://${
    process.env.LOGIN_HOST === 'test' ? 'test.' : ''
  }ssa.jd.com/sso/login`,
  pageSizeOptions: ['20', '30', '50'],
}
