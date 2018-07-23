## react项目前端脚手架

### feature

* 升级到react, react-dom, react-router最新版本。
* 升级到mobx4 最新版本，mobx5与4相同，但5只能运行在原生有Proxy类型的浏览器内，因此使用4，若不需要浏览器兼容，可切换到5，4与5的api相同。
* 使用webpack4最新版本构建，编译速度比webpack3有很大提升。
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
* 使用fetch获取接口数据。
    axios无法处理返回302的redirect状态，所以还是用fetch
    https://blog.csdn.net/orangleliu/article/details/79862248
    https://github.com/axios/axios/issues/980
    axios的maxRedirects: 0只在nodejs端有用，浏览器没用
* SearchForm使用时注意如果里面有Datepicker组件，若为时间格式则需要该表单项以Time结尾，否则不能正确识别为时间格式。
* 使用storeProp修饰mobx store，可自动生成一些store属性与方法。
* 开发模式默认使用3000端口，模拟后端数据的mockServer使用3009端口
* 在本地模拟接口数据开发环境中，直接使用请求路径的url在mockServer/fixture文件夹中写入对应的模拟数据即可生成响应。
* 所有接口都在app/api/index.js中配置，避免接口到处硬编码。
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

### 常用命令

* 开发模式
```
npm start
```

* 打包生成测试环境代码，登录环境为http://test.ssa.jd.com/sso/login
```
npm run build:test
```

* 到包生成生产环境代码，登录环境为https://ssa.jd.com/sso/login
* 发布到jdos必须有一个bin文件夹，放到public里，没什么内容，占位用
```
npm run build:production
// 或npm run production 相同
```

* 单元测试文件夹`__test__`，运行单元测试用例
  参考[jest文档](https://facebook.github.io/jest/)
```
npm test
```

* 单元测试代码覆盖率
  调用jest生成coverage文件夹，查看里面的index.html。
```
npm run coverage
```

* e2e测试用例在`e2e/specs`文件夹，运行e2e测试
  参考[nightwatch手册](http://nightwatchjs.org/api)
```
npm run e2e
```
  nightwatch会尝试使用当前的开发环境，如果没有启动则自动打开一个新的webpackDevServer服务，使用webpack.config文件中的端口号，并运行e2e测试用例。
  如果使用域名测试，需要配置本地hosts指向配置的域名后，将域名改为
  使用了一些额外的[nightwatch-helpers](https://npm.taobao.org/package/nightwatch-helpers)(尤大神作品)增强工具。
