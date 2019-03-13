import { exec, fork } from 'child_process'
import CopyWebpackPlugin = require('copy-webpack-plugin')
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
import HappyPack = require('happypack')
import HtmlWebpackPlugin = require('html-webpack-plugin')
import opn = require('opn')
import OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
import { cpus } from 'os'
import { join } from 'path'
import ResourceHintWebpackPlugin from 'resource-hints-webpack-plugin'
import * as rimraf from 'rimraf'
import SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
import {
  Configuration,
  DefinePlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  // SourceMapDevToolPlugin,
} from 'webpack'

// import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin = require('compression-webpack-plugin')
import MiniCssExtractPlugin = require('mini-css-extract-plugin')
import cdn = require('./build/cdn')
// import serverConfig from './mockServer/config'
// import getThemeConfig from './src/theme'
import devServerConfig = require('./build/config')
import resolveRoot = require('./build/resolveRoot')
import webpackResolve = require('./build/webpackResolve')
import * as serverConfig from './mockServer/config'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import appConfig from './src/config'

// 加载定制antd样式
// const theme = getThemeConfig()

type TNodeEnv = 'production' | 'development'

const NODE_ENV: TNodeEnv = (process.env.NODE_ENV as TNodeEnv) || 'development'
const isProd = NODE_ENV === 'production'

const lessLoadPaths = [resolveRoot('node_modules'), resolveRoot('src')]

// 根据环境变量，是否使用远程swagger接口调试
interface IProxyTarget {
  remote: string
  local: string
}
const proxyTargets: IProxyTarget = {
  remote: 'http://yourbackend.server',
  local: `http://${devServerConfig.host}:${serverConfig.port}`,
}

const envProxy: keyof IProxyTarget = (process.env.PROXY ||
  'local') as keyof IProxyTarget

const styleLoader = isProd
  ? MiniCssExtractPlugin.loader
  : {
      loader: 'style-loader',
      options: {
        sourceMap: true,
      },
    }

const { https, host, port } = devServerConfig

const config: Configuration = {
  entry: {
    index: [resolveRoot('src/index.js')],
  },
  output: {
    publicPath: '/',
    filename: 'asset/[name]-[hash:5].js',
    chunkFilename: 'asset/[name]-chunk-[chunkhash:5].js',
  },
  externals: cdn.externals,
  devServer: {
    ...devServerConfig,
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: true,
    hot: true,
    disableHostCheck: true,
    port,
    contentBase: './public',
    https,
    proxy: {
      [appConfig.baseURL]: {
        target: proxyTargets[envProxy],
        pathRewrite: { [`^${appConfig.baseURL}`]: '' },
        secure: false,
        changeOrigin: true,
      },
    },
    after: () => {
      opn(`http${https ? 's' : ''}://${host}:${devServerConfig.port}`)
    },
  },
  resolve: webpackResolve,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: !isProd,
              compact: isProd,
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre',
              exclude: /node_modules/,
            },
          },
        ],
        include: [resolveRoot('src')],
      },
      { test: /\.tsx?$/, loader: 'happypack/loader?id=ts' },
      {
        test: /\.m\.less$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: !isProd,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProd,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProd,
              javascriptEnabled: true,
              paths: lessLoadPaths,
            },
          },
        ],
      },
      {
        test: /\.theme\.less$/,
        use: [
          {
            loader: 'style-loader/useable',
            options: {
              sourceMap: !isProd,
              hmr: !isProd,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProd,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProd,
              javascriptEnabled: true,
              paths: lessLoadPaths,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProd,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isProd,
              javascriptEnabled: true,
              // modifyVars: theme,
            },
          },
        ],
        exclude: [/\.m\.less$/, /\.theme\.less$/],
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              minimize: isProd,
              sourceMap: !isProd,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProd,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '/images/[hash:8][name].[ext]',
            },
          },
        ],
      },
      // {
      //   test: /\.(svg)$/i,
      //   loader: 'svg-sprite-loader',
      //   include: [
      //     require.resolve('antd-mobile').replace(/warn\.js$/, ''),
      //     path.resolve(__dirname, 'src/images'),
      //   ],
      // },
      // {
      //   test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      //   exclude: [
      //     require.resolve('antd-mobile').replace(/warn\.js$/, ''),
      //     path.resolve(__dirname, 'src/images'),
      //   ],
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: '/fonts/[name].[hash:8].[ext]',
      //   },
      // },
    ],
  },
  plugins: [],
  devtool: false,
}

config.plugins = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: true,
    cdn: cdn.files[NODE_ENV].map(
      src => `<script rel="preload" src="${cdn.prefix}${src}"></script>`,
    ).join(''),
  }),
  new ResourceHintWebpackPlugin(),
  new NamedModulesPlugin(),
  new DefinePlugin({
    'process.env': {
      NODE_ENV: `"${NODE_ENV}"`,
      LOGIN_HOST: JSON.stringify(process.env.LOGIN_HOST),
    },
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: 'asset/[name].[hash:8].css',
    chunkFilename: 'asset/[name].[hash:8].css',
  }),
  // 可以优化不需要的额外moment的语言包
  new IgnorePlugin(/^\.\/locale$/, /moment$/),
  new HappyPack({
    id: 'ts',
    threads: cpus().length,
    loaders: [
      {
        loader: 'ts-loader',
        options: {
          // 打包分割必须
          compilerOptions: {
            module: 'esnext',
          },
          happyPackMode: true,
        },
      },
    ],
  }),
]

if (isProd) {
  // webpackResolve.alias['mobx-react-devtools'] = resolveRoot(
  //   'src/component/Null.jsx',
  // )

  rimraf.sync('./dist/*')
  // rimraf.sync('./dist/dist.zip')
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: './public/asset',
        to: join(__dirname, '/dist/asset'),
      },
      {
        from: './public/browser.html',
        to: join(__dirname, '/dist'),
      },
      {
        from: './public/manifest.json',
        to: join(__dirname, '/dist'),
      },
    ]),
    // 只压缩大于2k的js css html文件
    new CompressionPlugin({
      test: /\.(js|css|html|svg|doc|txt)$/,
      threshold: 2048,
    }),
    new OptimizeCSSAssetsPlugin(),
    // new BundleAnalyzerPlugin(),
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'serviceWorker.js',
      logger(message: string) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
        }
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: `/index.html`,
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
  )
  fork(resolveRoot('build/generate.js'))
} else {
  config.devtool = 'cheap-module-eval-source-map'
  config.plugins.push(
    // new SourceMapDevToolPlugin({
    //   filename: '[name].map',
    // }),
    new ForkTsCheckerWebpackPlugin(),
  )
  exec('npx nodemon --config build/nodemon.json build/generate.js')
}

export default config
