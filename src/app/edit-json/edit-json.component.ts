import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {ElectronService} from '../electron.service';
import {ActivatedRoute} from '@angular/router';
import {SaveConfigService} from '../share/service/save-config.service';
import {EventNameService} from '../share/service/event-name.service';

const EDITCONTENT = 'EDITCONTENT';

@Component({
  selector: 'app-edit-json',
  templateUrl: './edit-json.component.html',
  styleUrls: ['./edit-json.component.css']
})
export class EditJsonComponent implements OnInit, OnDestroy {
  @ViewChild('edit') _edit: ElementRef;
  cacheValue;
  routeParam: {id: string; port: string};

  editIns;
  constructor(
    private electronService: ElectronService,
    private activatedRoute: ActivatedRoute,
    private _saveCon: SaveConfigService,
    private _eventName: EventNameService
  ) { }

  ngOnInit() {
    this.routeParam = <any>this.activatedRoute.snapshot.params;

    this.cacheValue = this._saveCon.get(this.routeParam.port);
    if (this.cacheValue) {
      this.postMessage(this.cacheValue);
    }
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
      language: 'json',
      value: this.cacheValue
    });
  }

  send () {
    const value = this.editIns.getValue();
    this.postMessage(value);
  }

  postMessage(value) {
    this.electronService.ipcRenderer.send(this._eventName.ADD_INTERCEPT_URL, {
      id: this.activatedRoute.snapshot.params.id,
      data: value
    });
  }

  delete () {
    this.postMessage({});
  }

  ngOnDestroy() {
    this.removeResize();
    this._saveCon.save(this.routeParam.port, this.editIns.getValue());
  }
}
