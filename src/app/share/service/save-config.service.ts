import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveConfigService {

  constructor() { }

  save(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get (key) {
    return JSON.parse(window.localStorage.getItem(key));
  }
}
