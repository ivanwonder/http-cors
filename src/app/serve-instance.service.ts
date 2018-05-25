import { Injectable } from '@angular/core';

export interface DataOutput {
  id: any;
  port: number;
  targetUrl: string;
  type?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServeInstanceService {
  dataOutput: Array<DataOutput> = [];

  constructor() { }

  add (service: DataOutput) {
    this.dataOutput.push(Object.assign({}, service));
  }

  get () {
    return Array.from(this.dataOutput);
  }

  remove (id) {
    this.dataOutput = this.dataOutput.filter(item => item.id !== id);
    return this.dataOutput;
  }
}
