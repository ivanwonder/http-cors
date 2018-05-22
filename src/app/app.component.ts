import { Component, OnInit} from '@angular/core';
import {ElectronService} from './electron.service';
import Mousetrap from 'mousetrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  ipcRender;
  eleMap = new Map();
  parent = document.getElementById('server_opened');

  constructor(
    private electronService: ElectronService
  ) {
    this.ipcRender = electronService.ipcRenderer;
  }

  ngOnInit() {
    document.getElementById('createServer').addEventListener('click', function () {
      this.ipcRender.send('createServer', {
        port: (document.getElementById('port') as HTMLInputElement).value || 9393,
        proxyUrl: (document.getElementById('proxy_url') as HTMLInputElement).value || ''
      })
      this.ipcRender.on('message', function (event, message) {
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
    }.bind(this))

    this.ipcRender.on('serverCloseResult', (event, args) => {
      if (args.code === 0) {
        this.removeEle(args.id)
      }
    })
    
    this.ipcRender.on('serverOpenResult', (event, args) => {
      if (args.code === 0) {
        this.createProxyElement(args.id, args.args)
      }
    })

    const {PUT_TO_TRAY} = this.electronService.remote.require('./utils.js').eventConstant;
    Mousetrap.bind('esc', () => { this.ipcRender.send(PUT_TO_TRAY) }, 'keyup');
  }

  createProxyElement (id, args) {
    let li = document.createElement('li')
    let name = document.createTextNode(`server id: ${args.port}; proxyUrl: ${args.proxyUrl};`)
    let button = document.createElement('button')
    button.textContent = 'close proxy'
    button.addEventListener('click', () => this.ipcRender.send('closeServer', {id}))

    let button1 = document.createElement('button')
    button1.textContent = 'open log'
    button1.addEventListener('click', () => this.ipcRender.send('openLogFile', {id, type: 1}))

    let button2 = document.createElement('button')
    button2.textContent = 'show log in explorer'
    button2.addEventListener('click', () => this.ipcRender.send('openLogFile', {id, type: 2}))

    li.appendChild(name)
    li.appendChild(button)
    li.appendChild(button1)
    li.appendChild(button2)

    this.eleMap.set(id, li)

    this.parent.appendChild(li)
  }

  removeEle (id) {
    this.parent.removeChild(this.eleMap.get(id))
    this.eleMap.delete(id)
  }

}
