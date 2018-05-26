const {ipcMain, shell} = require('electron')
var openProxy = require('./proxy')
const {mainWindow} = require('../utils/map')
const childProcess = require('../utils/map').childProcess
const {proxyServerEvent} = require('../utils/event')
const {waitForChildProcessClose} = require('../utils/childProcess');

ipcMain.on('createServer', function (event, args) {
  const win = mainWindow.get('mainWindow')
  openProxy(args, (args) => {
    const message = args[0]
    if (message.closeServer) {
      proxyServerEvent.emit('closeServer', {id: args[1], message})
      win.webContents.send('message', {error: message.closeServer})
    }
  })
    .then((res) => {
      let message = res[0]
      let id = res[1]
      win.webContents.send('message', message)
      win.webContents.send('serverOpenResult', {id, code: 0, args})

      global.beforeQuitEvent.register(next => {
        return () => {
          let cp = childProcess.get(id)
          if (!cp) {
            next()
            return
          }
          cp.on('close', () => {
            next()
          })
          cp.on('error', (e) => {
            win.webContents.send('message', {error: e})
          })
          cp.kill()
        }
      }, id)
    }).catch(e => {
      win.webContents.send('message', e)
    })
})

ipcMain.on('closeServer', function (event, args) {
  proxyServerEvent.emit('closeServer', args)
})

proxyServerEvent.on('closeServer', function (args) {
  const id = args.id

  if (!id) return
  waitForChildProcessClose(childProcess.get(id)).then(() => {
    childProcess.delete(id)
    const win = mainWindow.get('mainWindow')
    win.webContents.send('serverCloseResult', {id, code: 0})
  })
})

ipcMain.on('openLogFile', function (event, args) {
  const id = args.id
  if (!id) return

  const type = args.type
  const MyFile = require('./file/file')
  const fileName = MyFile.logPathNameById(id)
  type === 1 && shell.openItem(fileName)
  type === 2 && shell.showItemInFolder(fileName)
})

const {PUT_TO_TRAY, ADD_INTERCEPT_URL, ADD_INTERCEPT_URL_STATUS} = require('./utils').eventConstant;

ipcMain.on(PUT_TO_TRAY, function () {
  const win = mainWindow.get('mainWindow');
  win && win.hide();
});

ipcMain.on(ADD_INTERCEPT_URL, function (event, arg) {
  if (arg.id) {
    const cp = childProcess.get(arg.id);
    cp.send(ADD_INTERCEPT_URL, arg.data);
    cp.once(ADD_INTERCEPT_URL_STATUS, function (env, _arg) {
      const win = mainWindow.get('mainWindow');
      win.webContents.send(ADD_INTERCEPT_URL_STATUS, {id: arg.id, data: _arg});
    })
  }
})
