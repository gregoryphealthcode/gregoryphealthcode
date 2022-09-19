import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppInfoService, ScreenService } from 'src/app/shared/services';

@Component({
  selector: 'app-preferences-sms',
  templateUrl: './preferences-sms.component.html',
  styleUrls: ['./preferences-sms.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class PreferencesSMSComponent implements OnInit {
  repliesTo: string[];
  smsprefsData: any = {};
  issmallscreen: boolean = false;
  form: FormGroup;

  constructor(
    public appInfo: AppInfoService, 
    public screenService: ScreenService
    ) {
    if (this.screenService.sizes['screen-small'] || this.screenService.sizes['screen-x-small']) {
      this.issmallscreen = true;
    }
  }

  saveClicked(e) {

  }

  cancelClicked(e) {

  }

  onReplyToValueChanged(e) {

  }

  onFormSubmit(e) {
  }

  ngOnInit() {
    this.repliesTo = ['No Replies', 'ePractice', 'Mobile Phone'];
    this.setupForm();
  }

  private setupForm() {
    this.form = new FormGroup({
      internationalCode: new FormControl(null, null),
      allowReplies: new FormControl(null, null),
      Replies: new FormControl(null, null)
    });
  }
}