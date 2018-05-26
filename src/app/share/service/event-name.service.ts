import { Injectable } from '@angular/core';
import {ElectronService} from '../../electron.service';

@Injectable({
  providedIn: 'root'
})
export class EventNameService {
  ADD_INTERCEPT_URL;
  ADD_INTERCEPT_URL_STATUS;

  constructor(
    private _electron: ElectronService
  ) {
    const {ADD_INTERCEPT_URL, ADD_INTERCEPT_URL_STATUS} = this._electron.remote.require('./utils.js').eventConstant;
    this.ADD_INTERCEPT_URL = ADD_INTERCEPT_URL;
    this.ADD_INTERCEPT_URL_STATUS = ADD_INTERCEPT_URL_STATUS;
  }
}
