// web/webpack.config.js

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const appDirectory = path.resolve(__dirname, '../');

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
  // Add every directory that needs to be compiled by Babel during the build.
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
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: [
        'module:metro-react-native-babel-preset',
        '@babel/preset-typescript', // Add this preset to handle TypeScript
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
          },
        ],
        '@babel/preset-react',
      ],
      // Re-write paths to import only the modules needed by the app
      plugins: [
        'react-native-web',
        '@babel/plugin-transform-react-jsx',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-reanimated/plugin',
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

const sharedConfig = {
  // ...the rest of your config
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
        { from: 'web/_redirects', to: '' },
        { from: 'assets/app icons/web/icon-512-maskable.png', to: '' },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: path.resolve(appDirectory, 'assets'), to: 'assets' }],
    // }),
  ],
};

const ssrConfig = {
  ...sharedConfig,
  entry: path.resolve(appDirectory, 'web/ssr-server/src/server.js'),
  output: {
    filename: 'bundle.ssr.js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
  },
  target: 'node', // Ensures that Webpack bundles for a Node.js environment
  externals: [nodeExternals()], // Tells Webpack to treat node_modules as external and not to bundle them
  externalsPresets: { node: true }, // Automatically externalize node modules
};

const webConfig = {
  ...sharedConfig,
  entry: path.resolve(appDirectory, 'web/index.web.js'),
  output: {
    filename: 'bundle.web.js', // This will dynamically name the output files based on the entry point names
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
  },
  target: 'web',
  devServer: {
    static: {
      directory: path.join(appDirectory, 'assets'), // Serve content from the assets directory
      publicPath: '/',
      watch: true,
    },
    historyApiFallback: true, // This is crucial for single-page applications
    hot: true, // Enable hot module replacement
    open: true, // Open the browser after the server has been started
    port: 3000, // Port to run the server on
  },
};

module.exports = [webConfig, ssrConfig];
