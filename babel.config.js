module.exports = {
  presets: ['module:@react-native/babel-preset',
    ["@babel/preset-typescript", {
      "allowDeclareFields": true
    }]
  ],
  plugins: [
    [
      "module-resolver",
      {
        "root": [__dirname],
        "alias": {
          "@": "./src",
          "%": "./assets",
        }
      }
    ]
  ]
};
