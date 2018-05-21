const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './main.js',
    deleteLogFile: './electron/childprocess/deleteLogFile.js',
    mainWindow: './electron/mainWindow.js',
    utils: './electron/utils.js'
  },
  target: 'node',
  externals: [
    function (context, request, callback) {
      if (/^electron$/.test(request)) {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    },
    function (context, request, callback) {
      // make the ./electron/utils as a externals.
      if (path.resolve(__dirname, './electron/utils') === path.resolve(context, request)) {
        return callback(null, 'commonjs ' + './utils');
      }
      callback();
    }
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(['dist', 'build', 'http-cors-win32-x64', 'http-cors-darwin-x64']),
    new CopyWebpackPlugin([
      // Ignore some files using glob in nested directory
      {
        from: './electron/resource',
        to: './resource'
      },
      {
        from: './package.json',
        to: './'
      }
      // {
      //   from: {glob: './electron/script/*.+(sh|bat)'},
      //   to: './script/[name].[ext]'
      // }
    ])
  ]
}
