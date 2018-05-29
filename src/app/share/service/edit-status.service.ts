import { Injectable } from '@angular/core';
import {Observable, Observer} from 'rxjs';

export declare type EditStatus = 'INIT' | 'SAVED' | 'CHANGED';

@Injectable({
  providedIn: 'root'
})
export class EditStatusService {
  private portStatus: {[key: string]: EditStatus} = {};
  private _publishChange: Observer<EditStatus>;
  public status$ = new Observable<EditStatus>((sub) => {
    this._publishChange = sub;
  });

  constructor() { }
  get (key) {
    key = String(key);
    if (this.portStatus[key]) {
      return this.portStatus[key];
    } else {
      this.portStatus[key] = 'INIT';
      return 'INIT';
    }
  }

  changeStatus(key, status: EditStatus) {
    key = String(key);
    this.portStatus[key] = status;
    this._publishChange.next(status);
  }
}
