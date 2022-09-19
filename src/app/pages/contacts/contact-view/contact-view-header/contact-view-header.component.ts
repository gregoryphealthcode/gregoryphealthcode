import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { tap } from "rxjs/operators";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { ContactDetailsModel } from "src/app/shared/services/contact.service";
import { ContactViewStore } from "../contact-view-store.service";

@Component({
  selector: "app-contact-view-header",
  templateUrl: "./contact-view-header.component.html",
  styleUrls: ["./contact-view-header.component.scss"],
})
export class ContactViewHeaderComponent extends SubscriptionBase implements OnInit {
  @Input() public isOrganisation: boolean;

  @Output() editContactClicked = new EventEmitter();

  public addressesCount: number;
  public telecomsCount: number;
  public contact: ContactDetailsModel;

  constructor(
    public store: ContactViewStore
  ) {
    super();
  }

  ngOnInit() {
    this.addToSubscription(
      this.store.contact$.pipe(
        tap((x) => {
          if (x) {
            this.contact = x;
            if (x.telecoms) {
              this.telecomsCount = x.telecoms.length;
            }
            else {
              this.telecomsCount = 0;
            }

            if (x.addresses) {
              this.addressesCount = x.length;
            }
            else {
              this.addressesCount = 0;
            }
          }
        })
      )
    );
  }

  showAllCliked() {
    console.log("show all clicked");
  }
}
