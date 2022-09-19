import { Injectable } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import notify from 'devextreme/ui/notify';


@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.available.subscribe(evt => {
      // an update is available, add some logic here.
      notify('Update available. Reloading...', 'success');
      setTimeout(() => {
          window.location.reload();
      }, 1500);
    }); 
  }
}