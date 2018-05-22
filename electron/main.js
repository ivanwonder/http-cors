const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {mainWindow} = require('../utils/map')
const isDev = require('electron-is-dev');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function leaveFullWindow () {
  return new Promise((resolve, reject) => {
    if (win.isFullScreen()) {
      win.setFullScreen(false);
      win.once('leave-full-screen', function () {
        resolve();
      })
    } else {
      resolve();
    }
  });
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  // win.loadURL(url.format({
  //   pathname: path.join(!isDev ? app.getAppPath() : path.resolve(__dirname), './resource/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  if (isDev) {
    win.loadURL('http://localhost:4200/');
  } else {
    win.loadURL(url.format({
      pathname: path.join(!isDev ? app.getAppPath() : path.resolve(__dirname), './my-app/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  mainWindow.set('mainWindow', win)

  // Open the DevTools.
  isDev && win.webContents.openDevTools()

  win.on('close', (event) => {
    leaveFullWindow(win).then(() => win.hide());
    event.preventDefault()
  })

  // 加载必要代码
  require('../utils/gloable')
  require('./ipcMain')
  require('./tray.js')
  require('./file/beginDelete')
  require('./menu')
  require('./shortcut');
}

app.on('quit', function () {
  win = null
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  win = null
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  } else {
    win.show()
  }
})

app.on('before-quit', function (event) {
  const _quit = require('./quit')
  if (!_quit.isPrepareToQuit()) {
    _quit.destroy()
    event.preventDefault()
  }
})

module.exports = createWindow;
