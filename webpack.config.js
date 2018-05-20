const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './main.js',
    deleteLogFile: './electron/childprocess/deleteLogFile.js'
  },
  target: 'node',
  externals: [
    function (context, request, callback) {
      if (/^electron$/.test(request)) {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    }
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
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
