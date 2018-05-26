const {childProcess} = require('../utils/map')
const path = require('path')
const {app} = require('electron')
const MyFile = require('./file/file')
const isDev = require('electron-is-dev');
const {_isWindows} = require('../utils/platform');
const {eventConstant} = require('./utils');

function openProxy (args, listen) {
  let _rej
  let _res
  let writeFile

  const _promise = new Promise((resolve, reject) => {
    _rej = reject
    _res = resolve
  })

  const id = new Date().getTime()

  const fork = require('child_process').fork
  const _ls = fork(path.join(!isDev ? app.getAppPath() : path.join(__dirname), './http-server/openProxy.js'), [], {
    detached: !!_isWindows,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    env: Object.assign({ADD_INTERCEPT_URL: eventConstant.ADD_INTERCEPT_URL, ADD_INTERCEPT_URL_STATUS: eventConstant.ADD_INTERCEPT_URL_STATUS}, process.env)
  })

  _ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    writeFile && writeFile.close()
  })

  function error (e) {
    console.log('error: ' + e)
    _rej({error: e})
  }

  _ls.on('error', error)

  _ls.on('message', function (message) {
    _ls.removeListener('error', error)
    if (message.success) {
      childProcess.set(id, _ls)

      // 记录代理日志
      writeFile = new MyFile(id)
      _ls.stdout.pipe(writeFile.writeAble)

      _res([message, id])
    } else if (message.error) {
      _rej(message)
    } else {
      listen([message, id])
    }
  })

  _ls.send({ open: {
    port: args.port,
    proxyUrl: args.proxyUrl,
    id
  } })

  return _promise
}

module.exports = openProxy
