const fs = require('fs')
const lowerFirst = require('lodash/lowerFirst')
const ejs = require('ejs')
const resolveRoot = require('./resolveRoot')
const prettyWrite = require('./prettyWrite')

const excludes = ['Home', '.DS_Store']

const generateRoute = () => {
  const routeTemplate = fs
    .readFileSync(resolveRoot('build/template/route.ejs'))
    .toString('utf8')

  const files = fs.readdirSync('./src/page').filter(file => {
    // Home在模板中已经定义为主路由
    if (excludes.includes(file)) {
      return false
    }
    return true
  })

  const pages = files.map(
    route =>
      `const ${route} = React.lazy(() => import(/* webpackChunkName: "${route}" */ './page/${route}'))`,
  )

  const routes = files.map(
    route => `{
      key: '${route}',
      component: (props: any) => <${route} {...props} />,
      path: '/${lowerFirst(route)}',
    }`,
  )

  const routeData = ejs.render(routeTemplate, {
    pages: pages.join('\n'),
    routes: `${routes.join(',\n  ')},`,
  })

  prettyWrite(routeData, 'src/route.tsx')
}

module.exports = generateRoute
