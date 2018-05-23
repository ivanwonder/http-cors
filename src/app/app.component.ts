import { Component, OnInit, NgZone} from '@angular/core';
import {ElectronService} from './electron.service';
import Mousetrap from 'mousetrap';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

interface DataOutput {
  id: any;
  port: number;
  targetUrl: string;
  type?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
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
    this.ipcRender.on('message', (event, message, time) => {
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
  }

}
