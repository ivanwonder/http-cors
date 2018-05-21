var electronInstaller = require('electron-winstaller')

var resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './http-cors-win32-x64',
  outputDirectory: './build/installer64',
  authors: 'ivan',
  // version: require('../package.json').version + '.0',
  // exe: 'myapp.exe',
  description: 'proxy server'
})

resultPromise.then(() => console.log('It worked!'), (e) => console.log(`No dice: ${e.message}`))
