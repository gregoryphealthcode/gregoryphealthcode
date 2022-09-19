import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { linkedOrganisationModel } from 'src/app/shared/services/contact.service';
import { ContactViewStore } from '../contact-view-store.service';

@Component({
  selector: 'app-contact-view-departments',
  templateUrl: './contact-view-departments.component.html',
  styleUrls: ['./contact-view-departments.component.scss']
})
export class ContactViewDepartmentsComponent extends SubscriptionBase implements OnInit {
  @Output() editDepartmentDetails = new EventEmitter<string>();

  constructor(
    public store: ContactViewStore,
    private router: Router,
  ) {
    super()
  }

  records: linkedOrganisationModel[];
  contactClassification: number;

  ngOnInit() {
    this.addToSubscription(
      this.store.departments$.pipe(tap(x => {
        if (x) {
          this.contactClassification = x.contactType.contactClassificationId;
          this.records = x.linkedDepartments;
        }
      }))
    )
  }

  getBackgroundColor(cellInfo) {
    return cellInfo.data.backgroundColor;
  }

  editDepartment(e) {
    this.editDepartmentDetails.emit(e.data.departmentId);
  }

  viewOrganisation(e) {
    this.router.navigate(['/view-contact/' + e.data.parentOrganisationId]);
  }
}
