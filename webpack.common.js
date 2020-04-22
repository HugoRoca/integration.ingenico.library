const path = require('path');
//const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
    /*main: './src/index.js',
    libs: [
      './node_modules/node-forge/dist/forge.min.js',
      './src/ingenico/connectsdk.js',
      './src/ingenico/connectsdk.noEncrypt.js'
    ]*/
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'forge': __dirname + '/node_modules/node-forge/dist/forge.min.js',
      'ingenico': __dirname + '/src/ingenico/connectsdk.js'
    }
  }
  //plugins: [new CleanWebpackPlugin()]
}
