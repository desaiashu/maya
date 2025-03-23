// SSR Server Compilation
// Starting with the web/webpack.config.js
// seeing if I can tweak it to get it working for ssr with fastify

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../../');
const ssrAppDirectory = __dirname;

// TODO combine appropriately with web/webpack.config.js
const compileNodeModules = [
  // Add every react-native package that needs compiling
  // 'react-native-gesture-handler',
  'react-native-reanimated',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /\.test\.js/, // Exclude test files
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'web/index.web.js'),
    path.resolve(appDirectory, 'web/maya.web.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(ssrAppDirectory, 'src'), // Ensure SSR-specific source files are included
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true, // Enable caching for faster rebuilds
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: [
        'module:metro-react-native-babel-preset',
        '@babel/preset-typescript', // Handle TypeScript files
        '@babel/preset-env', // Transpile to compatible JavaScript
        '@babel/preset-react', // Transpile React JSX to JavaScript
      ],
      // Re-write paths to import only the modules needed by the app
      plugins: [
        'react-native-web', // Re-map React Native components to React Native Web equivalents
        '@babel/plugin-transform-react-jsx', // Transform JSX to JavaScript
        '@babel/plugin-proposal-class-properties', // Support class properties
        '@babel/plugin-proposal-export-namespace-from', // Support export * as syntax
        'react-native-reanimated/plugin', // Plugin for react-native-reanimated
      ],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
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
  use: [
    'style-loader', // Injects styles into DOM
    'css-loader', // Translates CSS into CommonJS
  ],
};

module.exports = {
  entry: [path.resolve(ssrAppDirectory, 'src/server.js')],
  target: 'node',

  // configures where the build ends up
  output: {
    filename: 'bundle.ssr.js',
    path: path.resolve(ssrAppDirectory, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
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
  // devServer: {
  //   static: {
  //     directory: path.join(appDirectory, 'assets'), // Serve content from the assets directory
  //     publicPath: '/',
  //     watch: true,
  //   },
  //   historyApiFallback: true, // This is crucial for single-page applications
  //   hot: true, // Enable hot module replacement
  //   open: true, // Open the browser after the server has been started
  //   port: 3000, // Port to run the server on
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(appDirectory, 'web/index.html'),
      favicon: path.join(appDirectory, 'assets/app icons/web/favicon.ico'),
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
    new webpack.DefinePlugin({ process: { env: {} } }),
    new CopyPlugin({
      patterns: [
        { from: '../_redirects', to: '' },
        { from: '../../assets/app icons/web/icon-512-maskable.png', to: '' },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: path.resolve(appDirectory, 'assets'), to: 'assets' }],
    // }),
  ],
};
