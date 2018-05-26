import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ElectronService} from '../electron.service';

@Component({
  selector: 'app-edit-json',
  templateUrl: './edit-json.component.html',
  styleUrls: ['./edit-json.component.css']
})
export class EditJsonComponent implements OnInit {
  @ViewChild('edit') _edit: ElementRef
  constructor(
    private electronService: ElectronService
  ) { }

  ngOnInit() {
    this.initMonaco();
  }
  
  initMonaco() {
    var editor = (<any>window).monaco.editor.create(this._edit.nativeElement, {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      language: 'javascript'
    });
  }
}
