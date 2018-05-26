import { Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs/operators';
import {EditObserveService} from './edit-observe.service';
import {ElectronService} from './electron.service';
import {MatSnackBar} from '@angular/material'
import {EventNameService} from './share/service/event-name.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  editInstance = [];

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _edit$: EditObserveService,
    private electronService: ElectronService,
    private _zone: NgZone,
    private snackBar: MatSnackBar,
    private _eventName: EventNameService
  ) {
  }
  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      console.log(this.activatedRoute);
      const params = this.getEditId(this.activatedRoute);
      if (params) {
        const value = this.editInstance.find(item => item.id === params.id);
        if (!value) {
          this.editInstance.push(params);
        }
      }
      console.log(this.editInstance);
    });
    this._edit$.editDeleteObserve.subscribe(id => {
      this.editInstance = this.editInstance.filter(item => item.id !== String(id));
    });
       
    const self = this;
    this.electronService.ipcRenderer.on(this._eventName.ADD_INTERCEPT_URL_STATUS, function (event, message) {
      if (message.data.status) {
        self._zone.run(() => {
          self.snackBar.open('modify Successfully', '', {
            duration: 500,
            verticalPosition: 'top'
          });
        })
      }
    });
  }

  getEditId(router: ActivatedRoute) {
    const url = router.snapshot.url;
    if (url.length && url[0].path === 'edit') {
      return router.snapshot.params;
    }
    if (router.children.length) {
      return this.getEditId(router.children[0]);
    }
    return null;
  }

  ngOnDestroy() {
    this.electronService.ipcRenderer.removeAllListeners(this._eventName.ADD_INTERCEPT_URL_STATUS);
  }
}
