const reactVersion = require('react/package.json').version
const reactDomVersion = require('react-dom/package.json').version
const reactRouterVersion = require('react-router/package.json').version
const antdVersion = require('antd/package.json').version
const mobxVersion = require('mobx/package.json').version
const mobxReactVersion = require('mobx-react/package.json').version
const momentVersion = require('moment/package.json').version
const lodashVersion = require('lodash/package.json').version

// 根据开发环境注入不同的cdn文件
const prefix = 'https://unpkg.com/'

const externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router': 'ReactRouter',
  'react-router-dom': 'ReactRouterDOM',
  moment: 'moment',
  lodash: '_',
  mobx: 'mobx',
  'mobx-react': 'mobxReact',
  antd: 'antd',
}

const files = {
  development: [
    `react@${reactVersion}/umd/react.development.js`,
    `react-dom@${reactDomVersion}/umd/react-dom.development.js`,
    `react-router@${reactRouterVersion}/umd/react-router.js`,
    `react-router-dom@${reactRouterVersion}/umd/react-router-dom.js`,
    `mobx@${mobxVersion}/lib/mobx.umd.js`,
    `lodash@${lodashVersion}/lodash.js`,
    `moment@${momentVersion}/min/moment-with-locales.js`,
    `mobx-react@${mobxReactVersion}/index.js`,
    `antd@${antdVersion}/dist/antd-with-locales.min.js`,
  ],
  production: [
    `react@${reactVersion}/umd/react.production.min.js`,
    `react-dom@${reactDomVersion}/umd/react-dom.production.min.js`,
    `react-router@${reactRouterVersion}/umd/react-router.min.js`,
    `react-router-dom@${reactRouterVersion}/umd/react-router-dom.min.js`,
    `mobx@${mobxVersion}/lib/mobx.umd.js`,
    `lodash@${lodashVersion}/lodash.min.js`,
    `moment@${momentVersion}/min/moment-with-locales.min.js`,
    `mobx-react@${mobxReactVersion}/index.min.js`,
    `antd@${antdVersion}/dist/antd-with-locales.min.js`,
  ],
}

module.exports = {
  prefix,
  files,
  externals,
}
