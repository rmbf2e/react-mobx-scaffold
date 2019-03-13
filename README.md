# react项目前端脚手架

## feature

* [x] typescript重构.
* [x] 将storeProp改名为extendStore.
* [x] 目前路径别名有三个配置需要定义: webpack, tsconfg, jest，改为一处统一定义.
* [x] 重构extendStore, 在rest中复用setter.
* [x] 重构extendStore/list, 将fetchList从search中取值，改为接收查询参数的函数。
* [x] 重构router, store, tsconfig的自动生成功能，并添加监听文件修改。
* [x] 重构大部分模块的export，使用named export代替default
    [参考typescript-export-vs-default-export](https://stackoverflow.com/questions/33305954/typescript-export-vs-default-export)

* 紧跟最新稳定版本的react,react-dom,react-router,mobx,webpack。
* 使用`eslint-config-airbnb`检查js文件。
* 使用`less`。
* 使用`stylelint-config-recommended`，`stylelint-config-property-sort-order-smacss`检查less语法。
* 文件与目录使用单数英文单词命名。
* `build`文件夹存放代码构建脚本。
* `build/template`文件夹存放一些项目配置模板文件。
* 最终发布文件放到`dist`文件夹。
* 使用`mockServer`文件夹存放作为后端服务提供开发伪数据。
* ~~使用axios获取接口数据。~~
* 使用[fxios](https://github.com/superwf/fxios) (fetch的简单封装)获取接口数据。
    axios无法处理返回302的redirect状态，所以还是用fetch
    [参考🏁](https://blog.csdn.net/orangleliu/article/details/79862248)
    [参考🏁](https://github.com/axios/axios/issues/980)
    axios的maxRedirects: 0只在nodejs端有用，浏览器没用
* 当前项目与后端的约定配置，比如返回状态码为200则为成功，返回分页数据格式等，需要在src/tool/fxios中配置。
* QueryForm使用时注意如果里面有Datepicker组件，若为时间格式则需要该表单项以Time结尾，否则不能正确识别为时间格式。
  [QueryForm](https://github.com/rmbf2e/react-mobx-scaffold/blob/master/src/component/QueryForm/index.tsx)具体使用文档见代码注释。
* 使用`extendStore`修饰mobx store，可自动生成一些store属性与方法。
  具体每个修饰方法说明，见代码注释。
* 开发模式`webpack-dev-server`使用3000端口，模拟后端数据的mockServer使用3009端口。
  `webpack`配置使用ts。
  `mockServer`配置文件在`mockServer/config.js`。
* 在本地模拟接口数据开发环境中，直接使用请求路径的url在`mockServer/fixture`文件夹中写入对应的模拟数据即可生成响应。
* 所有接口地址都在`src/api/index.js`中配置，避免接口到处硬编码。
* 添加基于antd的样式主题. 每个主题文件会占1M以上的空间，如果不需要切换主题，可以在`component/Header`中移除`Theme`组件。

例如接口配置
src/api/index.js

```javascript
{
  me: 'user/me',
  ...
}
```

在本地开发模式中，在mockServer/fixture/me.json的结果将自动返回到该接口的请求结果中。
也可根据逻辑写成mockerServer/fixture/me.js，里面的内容可根据请求动态返回。

* 项目所用配置文件在src/config.js，详见代码注释。

* `src/page`文件夹内的每个组件都会自动映射为路由。例如`src/page/User`组件会映射为/user路由。
  如需要配置特殊路由，在`build/template/route.ejs`中单独配置。
  `src/route.tsx`每次启动项目会从文件`build/template/route.ejs`自动生成覆盖，所以不要编辑它。

* `src/store`文件夹中的文件会自动挂载为组件的mobx store。例如`src/store/user.js`，在组件内即`this.props.store.user`。

* 参考[mobx最佳实践](https://medium.com/dailyjs/mobx-react-best-practices-17e01cec4140)

* add commitizen and commitlint for git commit format

* add serviceWorker support, copy code from create-react-app example.
  in development env, you can generate self signed certificates
  [参考🏁](https://stackoverflow.com/questions/9519707/can-nodejs-generate-ssl-certificates)

  ```bash
  openssl genrsa -out server-key.pem 1024
  openssl req -new -key server-key.pem -out server-csr.pem
  openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
  ```

  and add ssl support to your local nginx conf file, see [nginx conf example](https://github.com/rmbf2e/react-mobx-scaffold/blob/master/nginx/default.conf)

  then start chrome in command line with ignore ignore certificates error param.

  ```bash
  google-chrome --unsafely-treat-insecure-origin-as-secure=https://dist.jd.m --ignore-certificate-errors
  ```

  see [localhost](https://localhost) to test your serviceWorker.

### 常用命令

* 本地模拟接口开发模式

```bash
yarn start
```

最初没有后端接口支持时，使用本地nodejs启动express提供后端接口。

* 后端接口联调阶段
  若有后端提供swiagger接口，可修改webpack.config.ts中的proxyTargets变量remote属性，指向后端接口域名。
然后用命令启动开发模式。

```bash
yarn dev:remote
```

此时基本不会再用本地模拟接口，可将package.json中的script中的start改为
    "start": "yarn run dev:remote | yarn run server",
继续用 `yarn start`来开发项目。

* 打包生成测试环境代码，登录环境为[sso](http://test.ssa.jd.com/sso/login)

```bash
yarn build:test
```

* 发布到生产环境。

```bash
yarn build:production
// 或yarn production 相同
```

* 单元测试文件夹`__test__`，运行单元测试用例
  参考[jest文档](https://facebook.github.io/jest/)

```bash
yarn test
```

* 单元测试代码覆盖率
  调用jest生成coverage文件夹，查看里面的index.html。

```bash
yarn coverage
```

* e2e使用[puppeteer](https://www.npmjs.com/package/puppeteer)

  由于`puppeteer`在每次安装都会下载一个`Chromium`非常耗时，实际使用的是`puppeteer-core`。
  下载后需要在`jest-puppeteer.config.js`文件中，修改`executablePath`对应当前系统的`chrome`执行路径后才能运行。

```bash
yarn e2e
```

* 使用changelog脚本自动生成CHANGELOG.md

```bash
yarn changelog
```
