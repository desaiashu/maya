const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DEV = process.argv.includes('development');

const appDirectory = path.resolve(__dirname, '../');

const compileNodeModules = [
  'react-native-reanimated',
  'react-native-markdown-display',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(appDirectory, 'web/index.web.js'),
    path.resolve(appDirectory, 'web/maya.web.tsx'),
    path.resolve(appDirectory, 'src'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: false,
      presets: [
        'module:@react-native/babel-preset',
        '@babel/preset-typescript',
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      plugins: [
        'react-native-web',
        '@babel/plugin-transform-react-jsx',
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-worklets/plugin',
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

const cssLoaderConfiguration = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
};

const esmResolutionConfig = {
  test: /\.m?js$/,
  resolve: {
    fullySpecified: false,
  },
};

const commonConfig = {
  module: {
    rules: [
      esmResolutionConfig,
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      cssLoaderConfiguration,
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '%': path.resolve(appDirectory, 'assets'),
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.js',
      '.js',
      '.jsx',
    ],
  },
};

const clientConfig = {
  ...commonConfig,
  entry: [path.resolve(appDirectory, 'web/index.web.js')],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'web/dist'),
    publicPath: '/',
  },
  plugins: [
    ...(DEV
      ? [
          new HtmlWebpackPlugin({
            template: path.join(appDirectory, 'web/index.html'),
          }),
        ]
      : []),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
    new webpack.DefinePlugin({ process: { env: {} } }),
    new CopyPlugin({
      patterns: [
        { from: 'assets/app icons/web/icon-512-maskable.png', to: '' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(appDirectory, 'assets'),
      publicPath: '/',
      watch: true,
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
  },
};

module.exports = [clientConfig];
