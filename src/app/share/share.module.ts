import {NgModule} from '@angular/core';
import {SaveConfigService} from './service/save-config.service';
import {EventNameService} from './service/event-name.service';
import {EditStatusService} from './service/edit-status.service';
@NgModule({
  providers: [SaveConfigService, EventNameService, EditStatusService],
})
export class ShareModule {}
