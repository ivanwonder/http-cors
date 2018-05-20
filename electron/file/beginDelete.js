const {fork} = require('child_process')
const isDev = require('electron-is-dev');
const {app} = require('electron')
const path = require('path')
const MyFile = require('./file')

const env = Object.assign({logPath: MyFile.path}, process.env)

// 在子进程中检查log文件，并删除过期log
fork(path.join(!isDev ? app.getAppPath() : path.join(__dirname, '../childprocess/'), './deleteLogFile.js'), [], {
  env
})
