const ipcRender = require('electron').ipcRenderer
document.getElementById('createServer').addEventListener('click', function () {
  ipcRender.send('createServer', {
    port: document.getElementById('port').value || 9393,
    proxyUrl: document.getElementById('proxy_url').value || ''
  })
  ipcRender.on('message', function (event, message) {
    let err = document.getElementById('error')
    if (message.error) {
      err.innerHTML = message.error
      err.style.display = ''
    }

    if (message.success) {
      err.style.display = 'none'
    }

    if (message.debug) {
      console.log(message.debug)
    }
  })
})

const eleMap = new Map()
const parent = document.getElementById('server_opened')

function createProxyElement (id, args) {
  let li = document.createElement('li')
  let name = document.createTextNode(`server id: ${args.port}; proxyUrl: ${args.proxyUrl};`)
  let button = document.createElement('button')
  button.textContent = 'close proxy'
  button.addEventListener('click', () => ipcRender.send('closeServer', {id}))

  let button1 = document.createElement('button')
  button1.textContent = 'open log'
  button1.addEventListener('click', () => ipcRender.send('openLogFile', {id, type: 1}))

  let button2 = document.createElement('button')
  button2.textContent = 'show log in explorer'
  button2.addEventListener('click', () => ipcRender.send('openLogFile', {id, type: 2}))

  li.appendChild(name)
  li.appendChild(button)
  li.appendChild(button1)
  li.appendChild(button2)

  eleMap.set(id, li)

  parent.appendChild(li)
}

function removeEle (id) {
  parent.removeChild(eleMap.get(id))
  eleMap.delete(id)
}

ipcRender.on('serverCloseResult', (event, args) => {
  if (args.code === 0) {
    removeEle(args.id)
  }
})

ipcRender.on('serverOpenResult', (event, args) => {
  if (args.code === 0) {
    createProxyElement(args.id, args.args)
  }
})

const Mousetrap = require('mousetrap');
const {PUT_TO_TRAY} = require('../../utils/constant');
Mousetrap.bind('esc', () => { ipcRender.send(PUT_TO_TRAY) }, 'keyup');
