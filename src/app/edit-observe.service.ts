import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditObserveService {

  public editDeleteObserve = new Subject();

  constructor() { }
}
