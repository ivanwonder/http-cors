import {NgModule} from '@angular/core'
import {SaveConfigService} from './service/save-config.service';
import {EventNameService} from './service/event-name.service';

@NgModule({
  providers: [SaveConfigService, EventNameService],
  
})
export class ShareModule {}
