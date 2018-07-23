import loader from 'app/polyfill'

loader.then(() => {
  import(/* webpackChunkName: "main" */ './main')
})
