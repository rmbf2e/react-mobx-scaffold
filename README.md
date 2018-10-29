## react项目前端脚手架

### TODO

* use typescript rewrite this scaffold.
* use puppeteer replace nightwatch.
* refector storeProp part.

### feature

* follow latest react, react-dom, react-router mobx webpack version
* use eslint-config-airbnb
* use less for style
* use stylelint-config-recommended，stylelint-config-property-sort-order-smacss
* use single word for dir and file name
* build文件夹存放代码构建脚本。
* 最终发布文件放到dist文件夹。
* 使用mockServer文件夹存放作为后端服务提供开发伪数据。
* ~~使用axios获取接口数据。~~
* 使用[fxios](https://github.com/superwf/fxios) (fetch的简单封装)获取接口数据。
    axios无法处理返回302的redirect状态，所以还是用fetch
    https://blog.csdn.net/orangleliu/article/details/79862248
    https://github.com/axios/axios/issues/980
    axios的maxRedirects: 0只在nodejs端有用，浏览器没用
* 当前项目与后端的约定配置，比如返回状态码为200则为成功，返回分页数据格式等，需要在src/tool/fxios中配置。
* QueryForm使用时注意如果里面有Datepicker组件，若为时间格式则需要该表单项以Time结尾，否则不能正确识别为时间格式。
  [QueryForm](https://github.com/rmbf2e/react-mobx-scaffold/blob/master/src/component/QueryForm/index.jsx)具体使用文档见代码注释。
* 使用storeProp修饰mobx store，可自动生成一些store属性与方法。
  具体每个修饰方法说明，见代码注释。
* 开发模式webpack使用3000端口，模拟后端数据的mockServer使用3009端口。
  webpack配置文件在build/config.js
  mockServer配置文件在mockServer/config.js
* 在本地模拟接口数据开发环境中，直接使用请求路径的url在mockServer/fixture文件夹中写入对应的模拟数据即可生成响应。
* 所有接口地址都在src/api/index.js中配置，避免接口到处硬编码。
例如接口配置
src/api/index.js
```
{
  me: 'user/me',
  ...
}
```
在本地开发模式中，在mockServer/fixture/me.json的结果将自动返回到该接口的请求结果中。
也可根据逻辑写成mockerServer/fixture/me.js，里面的内容可根据请求动态返回。

* 项目所用配置文件在src/config.js，详见代码注释。

* src/page文件夹内的每个组件都会自动映射为路由。例如src/page/User组件会映射为/user路由。
  如需要配置特殊路由，在src/route.template.jsx中单独配置。
  src/route.js每次启动项目会从src/route.template.jsx文件自动生成覆盖，所以不要编辑它。

* src/store文件夹中的文件会自动挂载为组件的mobx store。例如src/store/user.js，在组件内即this.props.store.user。

* 项目使用src/theme.js中的样式注入全局less环境，因此该文件中定义的less变量可在项目的所有.less或.m.less文件中使用，并覆盖antd的同名变量。缺点在于每次修改该文件后需要重启项目才能生效。参考[antd定制样式](https://ant.design/docs/react/customize-theme-cn)

* 参考[mobx最佳实践](https://medium.com/dailyjs/mobx-react-best-practices-17e01cec4140)

* add commitizen and commitlint for git commit format

* add serviceWorker support, copy code from create-react-app example.
  in development env, you can generate self signed certificates
  https://stackoverflow.com/questions/9519707/can-nodejs-generate-ssl-certificates
  ```
  openssl genrsa -out server-key.pem 1024
  openssl req -new -key server-key.pem -out server-csr.pem
  openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
  ```

  and add ssl support to your local nginx conf file, see [nginx conf example](https://github.com/rmbf2e/react-mobx-scaffold/blob/master/nginx/default.conf)

  then start chrome in command line with ignore ignore certificates error param.
  ```
  google-chrome --unsafely-treat-insecure-origin-as-secure=https://dist.jd.m --ignore-certificate-errors
  ```
  see [https://localhost] to test your serviceWorker.

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
    "start": "yarn run dev:remote | yarn run server",
继续用 `yarn start`来开发项目。

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
yarn test
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
  使用了一些额外的[nightwatch-helpers](https://www.npmjs.com/package/nightwatch-helpers)(尤大神作品)增强工具。

* 使用changelog脚本自动生成CHANGELOG.md

```
yarn changelog
```
