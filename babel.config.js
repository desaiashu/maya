module.exports = {
  presets: [
    // 'module:@react-native/babel-preset', #old
    'module:metro-react-native-babel-preset',
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
    '@babel/preset-env', // For ES6+
    '@babel/preset-react', // For JSX
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: [__dirname],
        alias: {
          '@': './src',
          '%': './assets',
          '^react-native$': 'react-native-web',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
