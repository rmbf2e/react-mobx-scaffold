## react项目前端脚手架

### feature

* 升级到react, react-dom, react-router最新版本。
* 升级到mobx 最新版本。
* 使用webpack4最新版本构建。
* 使用eslint的airbnb为主验证规则。
* 统一使用less作为默认样式文件。
* 使用less后项目不依赖node-sass，可以随node版本升级而不需要重新安装node\_modules。
* 使用stylelint-config-recommended，stylelint-config-property-sort-order-smacss为主css验证规则。
* 用app取代src文件夹作为源代码主文件夹。
* 所有子文件夹都使用单数命名方式，减少单复数命名混乱问题。
* build文件夹存放代码构建脚本。
* 最终发布文件放到dist文件夹。
* 使用mockServer文件夹存放作为后端服务提供开发伪数据。
* ~~使用axios获取接口数据。~~
* 使用[fxios](https://github.com/superwf/fxios) (fetch的简单封装)获取接口数据。
    axios无法处理返回302的redirect状态，所以还是用fetch
    https://blog.csdn.net/orangleliu/article/details/79862248
    https://github.com/axios/axios/issues/980
    axios的maxRedirects: 0只在nodejs端有用，浏览器没用
* 当前项目与后端的约定配置，比如返回状态码为200则为成功，返回分页数据格式等，需要在app/tool/fxios中配置。
* SearchForm使用时注意如果里面有Datepicker组件，若为时间格式则需要该表单项以Time结尾，否则不能正确识别为时间格式。
  [SearchForm](https://github.com/rmbf2e/react-mobx-scaffold/blob/master/app/component/SearchForm/index.jsx)具体使用文档见代码注释。
* 使用storeProp修饰mobx store，可自动生成一些store属性与方法。
  具体每个修饰方法说明，见代码注释。
* 开发模式webpack使用3000端口，模拟后端数据的mockServer使用3009端口。
  webpack配置文件在build/config.js
  mockServer配置文件在mockServer/config.js
* 在本地模拟接口数据开发环境中，直接使用请求路径的url在mockServer/fixture文件夹中写入对应的模拟数据即可生成响应。
* 所有接口地址都在app/api/index.js中配置，避免接口到处硬编码。
例如接口配置
app/api/index.js
```
{
  me: 'user/me',
  ...
}
```
在本地开发模式中，在mockServer/fixture/user/me.json的结果将自动返回到该接口的请求结果中。
也可根据逻辑写成mockerServer/fixture/user/me.js，里面的内容可根据请求动态返回。

* 项目所用配置文件在app/config.js，详见代码注释。
* app/page文件夹内的每个组件都会自动映射为路由。例如app/page/User组件会映射为/user路由。
  如需要配置特殊路由，在app/router.template.jsx中单独配置。
  app/router.jsx每次启动项目会从app/router.template.jsx文件自动生成覆盖，所以不要编辑它。
* app/store文件夹中的文件会自动挂载为组件的mobx store。例如app/store/user.js，在组件内即this.props.store.user。
* 项目使用app/theme.js中的样式注入全局less环境，因此该文件中定义的less变量可在项目的所有.less或.m.less文件中使用，并覆盖antd的同名变量。缺点在于每次修改该文件后需要重启项目才能生效。参考[antd定制样式](https://ant.design/docs/react/customize-theme-cn)
* 参考[mobx最佳实践](https://medium.com/dailyjs/mobx-react-best-practices-17e01cec4140)

### 常用命令

* 本地模拟接口开发模式
```
yarn start
```
最初没有后端接口支持时，使用本地nodejs启动express提供后端接口。

* 后端接口联调阶段
  若有后端提供swiagger接口，可修改webpack.config.babel.js中的proxyTargets变量remote属性，指向后端接口域名。
然后用命令启动开发模式。
```
yarn dev:remote
```
此时基本不会再用本地模拟接口，可将package.json中的script中的start改为
    "start": "npm run dev:remote | npm run server",
继续用 `npm start`来开发项目。

* 打包生成测试环境代码，登录环境为http://test.ssa.jd.com/sso/login
```
yarn build:test
```

* 发布到生产环境。
```
yarn build:production
// 或yarn production 相同
```

* 单元测试文件夹`__test__`，运行单元测试用例
  参考[jest文档](https://facebook.github.io/jest/)
```
npm test
```

* 单元测试代码覆盖率
  调用jest生成coverage文件夹，查看里面的index.html。
```
yarn coverage
```

* e2e测试用例在`e2e/specs`文件夹，运行e2e测试
  参考[nightwatch手册](http://nightwatchjs.org/api)
```
yarn e2e
```
  nightwatch启动脚本会尝试使用当前的开发环境，如果没有启动则自动打开一个新的webpackDevServer服务，使用webpack.config文件中的端口号，并运行e2e测试用例。
  如果使用域名测试，需要配置本地hosts指向配置的域名后，将域名改为
  使用了一些额外的[nightwatch-helpers](https://npm.taobao.org/package/nightwatch-helpers)(尤大神作品)增强工具。
