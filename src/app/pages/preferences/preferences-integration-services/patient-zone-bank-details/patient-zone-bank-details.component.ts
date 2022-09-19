import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { MedsecSitesViewModel } from 'src/app/shared/models/UserAllowedSitesViewModel';
import { AppInfoService, TitlesViewModel } from 'src/app/shared/services';
import { UserService } from 'src/app/shared/services/user.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';

@Component({
  selector: 'app-patient-zone-bank-details',
  templateUrl: './patient-zone-bank-details.component.html',
  styleUrls: ['./patient-zone-bank-details.component.scss']
})

@AutoUnsubscribe
export class PatientZoneBankDetailsComponent extends SubscriptionBase implements OnInit {
  @Input() siteId: string;
  @Input() get practitionerSelected(): MedsecSitesViewModel {
    return this._practitionerSelected;
  }
  set practitionerSelected(val: MedsecSitesViewModel) {
    if (val) {
      this._practitionerSelected = val;
      this.populateForm(val);
    }
  }
  @Output() formClosed = new EventEmitter();
  @Output() bankDetailsAdded = new EventEmitter<MedsecSitesViewModel>();

  private _practitionerSelected: MedsecSitesViewModel;
  form: FormGroup;
  lluTitles: TitlesViewModel[] = [];

  constructor(
    private userService: UserService,
    private appInfo: AppInfoService
  ) {
    super();
    this.setupForm();
  }

  ngOnInit() {
    this.getTitles();
  }

  getTitles() {
    this.subscription.add(this.userService.getTitlesForSite(this.siteId).subscribe(data => {
      this.lluTitles = data;
    }));
  }

  firstLetterCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) { textcontent = textcontent.toUpperCase(); }
    if (textcontent.length > 2) {

      if (textcontent[textcontent.length - 2] === ' ' || textcontent[textcontent.length - 2] === '\'') {
        let s = '' + textcontent[(textcontent.length - 1)];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  close() {
    this.formClosed.emit();
  }

  add() {
    this.practitionerSelected.accountName = this.form.get('accountName').value;
    this.practitionerSelected.accountNumber = this.form.get('accountNumber').value;
    this.practitionerSelected.bankName = this.form.get('bankName').value;
    this.practitionerSelected.sortCode = this.form.get('sortCode').value;
    this.practitionerSelected.firstName = this.form.get('userDetailsFirstName').value;
    this.practitionerSelected.lastName = this.form.get('userDetailsLastName').value;
    this.practitionerSelected.title = this.form.get('userDetailsTitle').value;
    this.practitionerSelected.telephone = this.form.get('mobile').value;
    this.practitionerSelected.emailAddress = this.form.get('userDetailsEmail').value;
    this.practitionerSelected.useOwnBank = 'Practitioner';
    this.bankDetailsAdded.emit(this.practitionerSelected);
  }

  private setupForm() {
    this.form = new FormGroup({
      mobile: new FormControl(null, Validators.compose([Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/), Validators.required])),
      userDetailsEmail: new FormControl(false, [Validators.pattern(this.appInfo.getEmailFormat()), Validators.required]),
      userDetailsLastName: new FormControl(null, null),
      userDetailsFirstName: new FormControl(null, null),
      userDetailsTitle: new FormControl(null, null),
      accountName: new FormControl(null, null),
      sortCode: new FormControl(false, [Validators.maxLength(9)]),
      accountNumber: new FormControl(null, [Validators.maxLength(8), Validators.minLength(8)]),
      bankName: new FormControl(null, null),
      firstName: new FormControl(null, null),
      lastName: new FormControl(null, null)
    });
  }

  populateForm(value: MedsecSitesViewModel) {
    this.form.patchValue({ userDetailsFirstName: value.firstName });
    this.form.patchValue({ userDetailsLastName: value.lastName });
    this.form.patchValue({ userDetailsTitle: value.title === undefined ? 'Mr' : value.title });
  }
}
