// copy from vue-cli created app
import webpack from 'webpack'
import DevServer from 'webpack-dev-server'
import spawn from 'cross-spawn'
import portfinder from 'portfinder'
import chalk from 'chalk'
import webpackConfig from '../webpack.config.babel'

const { log } = console

async function run() {
  // 1. start webpack dev server
  const compiler = webpack(webpackConfig)
  const config = webpackConfig.devServer
  const port = process.env.PORT || config.port
  portfinder.basePort = port
  let server
  // 检测端口是否被占用，若已被占用则认为开发模式服务已经启动
  const availablePort = await portfinder.getPortPromise()
  if (availablePort === port) {
    server = new DevServer(compiler, config)
    server.listen(port, config.host)
    log(chalk.green('server starting'))
  } else {
    log(chalk.blue(`port ${port} is already listening`))
  }

  // 2. run the nightwatch test suite against it
  // to run in additional browsers:
  //    1. add an entry in e2e/nightwatch.conf.js under "test_settings"
  //    2. add it to the --env flag below
  // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
  // For more information on Nightwatch's config file, see
  // http://nightwatchjs.org/guide#settings-file
  let opts = process.argv.slice(2)
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'e2e/nightwatch.conf.js'])
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome'])
  }

  const runner = spawn('./node_modules/.bin/nightwatch', opts, {
    stdio: 'inherit',
  })

  runner.on('exit', code => {
    if (server) {
      server.close()
    }
    process.exit(code)
  })

  runner.on('error', err => {
    if (server) {
      server.close()
    }
    throw err
  })
}

run()
