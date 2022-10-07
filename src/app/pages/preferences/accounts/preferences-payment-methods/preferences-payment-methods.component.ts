import { Component, OnInit } from '@angular/core';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import notify from 'devextreme/ui/notify';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { GenericViewModel, MethodTypeModel, UserService } from 'src/app/shared/services/user.service';
import { AppMessagesService } from 'src/app/shared/services/app-messages.service';

@Component({
  selector: 'app-preferences-payment-methods',
  templateUrl: './preferences-payment-methods.component.html',
  styleUrls: ['./preferences-payment-methods.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
@AutoUnsubscribe
export class PreferencesPaymentMethodsComponent extends SubscriptionBase implements OnInit {
  selectedRowData: any = null;
  paymentTypes: MethodTypeModel[] = [];
  uniqueNo = 0;
  methodDescription = '';
  siteId: string;
  showPaymentMethodPopup: boolean;
  isNew = false;

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    private userService: UserService,
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private appMessage: AppMessagesService,
  ) {
    super();

  }

  getPaymentMethods() {
    this.subscription.add(this.userService.getPaymentMethodTypes().subscribe(data => {
      this.paymentTypes = data;
      this.spinnerService.stop();
    },
      error => {
        this.spinnerService.stop();
      }));
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

  public onFocusedRowChanged(e) {
    this.selectedRowData = e.row.data;
  }

  addOKClicked() {
    this.showPaymentMethodPopup = true;
    const model = new GenericViewModel();
    model.description = this.methodDescription;
    model.siteId = this.siteId
    model.uniqueNo = this.uniqueNo;

    this.subscription.add(this.siteService.updatePaymentType(model).subscribe(() => {
      notify('Payment Method Saved.', 'success');
      this.getPaymentMethods();
    },
      error => {
        const errorText = 'Error adding payment method! :' + error;
        notify(errorText, 'error');
      }
    ));
  }

  addCancelClicked() {
    this.showPaymentMethodPopup = false;
  }

  add() {
    this.isNew = true;
    this.uniqueNo = 0;
    this.methodDescription = '';
    this.showPaymentMethodPopup = true;
  }

  edit(e) {
    this.uniqueNo = e.row.data.uniqueNo;
    this.methodDescription = e.row.data.description
    this.isNew = false;
    this.showPaymentMethodPopup = true;
  }

  confirmDelete(uniqueNo) {
    this.spinnerService.start();
    this.subscription.add(this.siteService.deletePaymentMethod(uniqueNo).subscribe(data => {
      this.getPaymentMethods();
      notify('Payment Method Deleted.', 'success');
      this.spinnerService.stop();

    },
      error => {
        const errorText = 'Error deleting message! :' + error;
        notify(errorText, 'error');
        this.spinnerService.stop();
      }));
  }
  deletePaymentMethod(e) {
    const text = `Are you sure you want to permanently delete ${e.row.data.description}?`;
    this.appMessage.showAskForConfirmationModal(
      'Delete Payment Type',
      text,
      () => this.confirmDelete(e.row.data.uniqueNo),
      () => { }

    );
    return;
  }

  ngOnInit() {
    this.spinnerService.start();
    this.siteId = this.userStore.getSiteId();
    this.getPaymentMethods();
  }
}
