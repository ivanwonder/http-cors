const {globalShortcut} = require('electron');

const accelerators = 'CommandOrControl+Alt+P';

const ret = globalShortcut.register(accelerators, () => {
  const win = require('../utils/map').mainWindow.get('mainWindow');
  if (!win) {
    require('./main')();
  } else {
    win.show()
  }
})

if (!ret) {
  console.log('registration failed');
}

global.beforeQuitEvent.register(next => {
  return () => {
    globalShortcut.unregisterAll();
  }
}, Date.now())
