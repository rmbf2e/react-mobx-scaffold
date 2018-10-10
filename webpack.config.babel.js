import cp from 'child_process'
import path from 'path'
import webpack from 'webpack'
import opn from 'opn'
import rimraf from 'rimraf'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import appConfig from './app/config'
import serverConfig from './mockServer/config'
import getThemeConfig from './app/theme'
import devServerConfig from './build/config'

// 加载定制antd样式
const theme = getThemeConfig()

const isProd = process.env.NODE_ENV === 'production'

const resolvePath = relativePath => path.resolve(__dirname, relativePath)

// 是否使用远程swagger接口调试
const proxyTargets = {
  remote: 'http://your.backend',
  local: `http://localhost:${serverConfig.port}`,
}
const envProxy = process.env.PROXY || 'local'

cp.fork('./build/generateRoute.js')
cp.fork('./build/generateStore.js')

// import的路径别名
const alias = {
  tool: resolvePath('./app/tool'),
  component: resolvePath('./app/component'),
  page: resolvePath('./app/page'),
  store: resolvePath('./app/store'),
  style: resolvePath('./app/style'),
  mixin: resolvePath('./app/mixin'),
  app: resolvePath('./app'),
  fixture: resolvePath('./__test__/fixture'),
}

const styleLoader = isProd
  ? MiniCssExtractPlugin.loader
  : {
      loader: 'style-loader',
      options: {
        sourceMap: true,
      },
    }

const config = {
  entry: {
    index: [resolvePath('./app/index.js')],
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
    port: 3030,
    contentBase: './public',
    proxy: {
      [appConfig.baseURL]: {
        target: proxyTargets[envProxy],
        pathRewrite: { [`^${appConfig.baseURL}`]: '' },
        secure: false,
        // changeOrigin: true,
      },
    },
    ...devServerConfig,
    after: () => {
      const protocal = devServerConfig.https ? 'https' : 'http'
      opn(`${protocal}://localhost:${devServerConfig.port}`)
    },
  },
  resolve: {
    alias,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less'],
  },
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
          resolvePath('./app'),
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
              modifyVars: theme,
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
              modifyVars: theme,
            },
          },
        ],
        exclude: /\.m\.less$/,
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
      //     path.resolve(__dirname, 'app/images'),
      //   ],
      // },
      // {
      //   test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      //   exclude: [
      //     require.resolve('antd-mobile').replace(/warn\.js$/, ''),
      //     path.resolve(__dirname, 'app/images'),
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
  alias['mobx-react-devtools'] = resolvePath('./app/component/Null.jsx')

  rimraf.sync('./dist/*')
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: './public/asset',
        to: path.join(__dirname, '/dist/asset'),
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: './public/bin',
        to: path.join(__dirname, '/dist/bin'),
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: './public/browser.html',
        to: path.join(__dirname, '/dist'),
      },
    ]),
    // 只压缩大于2k的js css html文件
    new CompressionPlugin({
      test: /\.(js|css|html|svg|doc|txt)$/,
      threshold: 2048,
    }),
    // new BundleAnalyzerPlugin(),
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
