import { Component, OnInit, NgZone} from '@angular/core';
import {ElectronService} from './electron.service';
import Mousetrap from 'mousetrap';

interface DataOutput {
  id: any;
  port: number;
  targetUrl: string;
  type?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dataInput = ['port', 'targetUrl'];
  dataOutput: Array<DataOutput> = [];
  port = '';
  targetUrl = '';

  error = {
    hasError: false,
    errorInfo: ''
  };

  ipcRender;
  eleMap = new Map();
  parent = document.getElementById('server_opened');

  constructor(
    private electronService: ElectronService,
    private _zone: NgZone
  ) {
    this.ipcRender = electronService.ipcRenderer;
  }

  ngOnInit() {
    this.ipcRender.on('serverCloseResult', (event, args) => {
      if (args.code === 0) {
        this._zone.run(() => this.removeEle(args.id));
        // this.removeEle(args.id);
      }
    });

    this.ipcRender.on('serverOpenResult', (event, args) => {
      if (args.code === 0) {
        this._zone.run(() => this.createProxyElement(args.id, args.args));
      }
    });

    const {PUT_TO_TRAY} = this.electronService.remote.require('./utils.js').eventConstant;
    Mousetrap.bind('esc', () => { this.ipcRender.send(PUT_TO_TRAY); }, 'keyup');
  }

  createProxyElement (id, args) {
    const item: DataOutput = {
      id,
      port: args.port,
      targetUrl: args.proxyUrl
    };
    this.dataOutput.push(item);
  }

  close(item: DataOutput) {
    this.ipcRender.send('closeServer', {id: item.id});
  }

  open(type, item: DataOutput) {
    this.ipcRender.send('openLogFile', {id: item.id, type});
  }

  removeEle (id) {
    this.dataOutput = this.dataOutput.filter(item => item.id !== id);
  }

  create() {
    this.ipcRender.send('createServer', {
      port: this.port || 9393,
      proxyUrl: this.targetUrl || ''
    });
    this.ipcRender.on('message', (event, message) => {
      this._zone.run(() => {
        if (message.error) {
          this.error.hasError = true;
          this.error.errorInfo = message.error;
        }

        if (message.success) {
          this.error.hasError = false;
        }

        if (message.debug) {
          console.log(message.debug);
        }
      });
    });
  }

}
