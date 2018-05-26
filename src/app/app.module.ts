import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ElectronService} from './electron.service';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule, Routes} from '@angular/router';
import {CreateServeComponent} from './create-serve/create-serve.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { EditJsonComponent } from './edit-json/edit-json.component';
import {ServeInstanceService} from './serve-instance.service';
import {EditObserveService} from './edit-observe.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ShareModule} from './share/share.module';
import {MatMenuModule} from '@angular/material/menu';

const appRoutes: Routes = [{
  path: '',
  component: CreateServeComponent
}, {
  path: 'edit/:id/:port',
  component: EditJsonComponent
}];

@NgModule({
  declarations: [
    AppComponent,
    CreateServeComponent,
    EditJsonComponent
  ],
  imports: [
    ShareModule,
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [ElectronService, ServeInstanceService, EditObserveService],
  entryComponents: [CreateServeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
