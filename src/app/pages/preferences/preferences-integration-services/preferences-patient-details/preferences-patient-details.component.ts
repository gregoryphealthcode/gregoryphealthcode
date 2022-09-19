import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from "@angular/core";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { AppInfoService } from "src/app/shared/services/app-info.service";
import { SitesStore } from "src/app/shared/stores/sites.store";

@Component({
  selector: 'app-preferences-patient-details',
  templateUrl: './preferences-patient-details.component.html',
  styleUrls: ['./preferences-patient-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PreferencesPatientDetailsComponent extends SubscriptionBase implements OnInit {
  @Output() listoptionadded: EventEmitter<any> = new EventEmitter();

  showAddListOptionPopup: boolean;
  addListOptionDescription = '';
  addListOptionValue = '';

  constructor(
    private siteStore: SitesStore, public appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit() {
  }

  addListOptionButtonClicked(listdata, typedescription) {
    this.addListOptionDescription = typedescription;
    this.addListOptionValue = '';
    this.showAddListOptionPopup = true;
    this.subscription.add(
      this.listoptionadded.subscribe(Value => {
        if (listdata === null) { listdata = [Value]; } else { listdata.push(Value); }
      }));
    return Promise.resolve('Dummy response to keep the console quiet');
  }

  saveListOptionClicked(e) {
    this.showAddListOptionPopup = false;
    this.listoptionadded.emit(this.addListOptionValue);
  }

  cancelListOptionClicked(e) {
    this.showAddListOptionPopup = false;
  }

  firstLetterCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) { textcontent = textcontent.toUpperCase(); }
    if (textcontent.length > 2) {
      if (textcontent[textcontent.length - 2] === ' ' || textcontent[textcontent.length - 2] === "'") {
        let s = '' + textcontent[(textcontent.length - 1)];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }
}