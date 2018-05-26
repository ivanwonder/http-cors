import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {ElectronService} from '../electron.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-json',
  templateUrl: './edit-json.component.html',
  styleUrls: ['./edit-json.component.css']
})
export class EditJsonComponent implements OnInit, OnDestroy {
  @ViewChild('edit') _edit: ElementRef
  editIns;
  constructor(
    private electronService: ElectronService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.resizeListen.bind(this);
    this.listenResize();
    this.initMonaco();
  }

  resizeListen() {
    this.editIns.layout();
  }

  listenResize () {
    window.addEventListener('resize', this.resizeListen.bind(this));
  }

  removeResize () {
    window.removeEventListener('resize', this.resizeListen.bind(this));
  }
  
  initMonaco() {
    this.editIns = (<any>window).monaco.editor.create(this._edit.nativeElement, {
      language: 'json'
    });
  }

  send () {
    const value = this.editIns.getValue();
    const {ADD_INTERCEPT_URL, ADD_INTERCEPT_URL_STATUS} = this.electronService.remote.require('./utils.js').eventConstant;    
    this.electronService.ipcRenderer.send(ADD_INTERCEPT_URL, {
      id: this.activatedRoute.snapshot.params.id,
      data: value
    });
  }

  ngOnDestroy() {
    this.removeResize();
  }
}
