import cp from 'child_process'
import path from 'path'
import webpack from 'webpack'
import opn from 'opn'
import rimraf from 'rimraf'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import appConfig from './src/config'
import serverConfig from './mockServer/config'
// import getThemeConfig from './src/theme'
import devServerConfig from './build/config'
import webpackResolve from './build/webpackResolve'

// 加载定制antd样式
// const theme = getThemeConfig()

const isProd = process.env.NODE_ENV === 'production'

const resolvePath = relativePath => path.resolve(__dirname, relativePath)

// 是否使用远程swagger接口调试
const proxyTargets = {
  remote: 'http://your.backend',
  local: `http://${devServerConfig.host}:${serverConfig.port}`,
}
const envProxy = process.env.PROXY || 'local'

cp.fork('./build/generateRoute.js')
cp.fork('./build/generateStore.js')

const styleLoader = isProd
  ? MiniCssExtractPlugin.loader
  : {
      loader: 'style-loader',
      options: {
        sourceMap: true,
      },
    }

const { protocal, host, port } = devServerConfig
const config = {
  entry: {
    index: [resolvePath('./src/index.js')],
  },
  output: {
    publicPath: '/',
    filename: 'asset/[name]-[hash:5].js',
    chunkFilename: 'asset/[name]-chunk-[chunkhash:5].js',
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: true,
    hot: true,
    disableHostCheck: true,
    contentBase: './public',
    proxy: {
      [appConfig.baseURL]: {
        target: proxyTargets[envProxy],
        pathRewrite: { [`^${appConfig.baseURL}`]: '' },
        secure: false,
        // changeOrigin: true,
      },
    },
    port,
    https: protocal === 'https',
    after: () => {
      opn(`${protocal}://${host}:${port}`)
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
        include: [
          resolvePath('./src'),
          resolvePath('./node_modules/lodash-es'),
        ],
      },
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
              // modifyVars: theme,
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
              // modifyVars: theme,
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
}

config.plugins = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: true,
    minify: isProd
      ? {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          minifyJS: true,
        }
      : false,
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
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
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
]

if (isProd) {
  webpackResolve.alias['mobx-react-devtools'] = resolvePath(
    './src/component/Null.jsx',
  )

  rimraf.sync('./dist/*')
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: './public/manifest.json',
        to: path.join(__dirname, '/dist'),
      },
      {
        from: './public/asset',
        to: path.join(__dirname, '/dist/asset'),
      },
      {
        from: './public/browser.html',
        to: path.join(__dirname, '/dist'),
      },
      {
        from: './public/bin',
        to: path.join(__dirname, '/dist/bin'),
      },
    ]),
    // 只压缩大于2k的js css html文件
    new CompressionPlugin({
      test: /\.(js|css|html|svg|doc|txt)$/,
      threshold: 2048,
    }),
    // new BundleAnalyzerPlugin(),
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'serviceWorker.js',
      logger(message) {
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
  config.optimization = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css`
          // 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
          test: /node_modules\/react/,
          name: true,
          priority: 10,
          enforce: true,
        },
        // 将所有零散的antd样式打包
        styles: {
          name: 'styles',
          test: /\.less$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,
            dead_code: true,
          },
          output: {
            comments: false,
          },
        },
        // sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  }
  // config.devtool = 'none'
} else {
  config.devtool = 'cheap-module-eval-source-map'
}

export default config
