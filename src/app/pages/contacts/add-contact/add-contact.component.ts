import { Component, OnInit, Input, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Guid from 'devextreme/core/guid';
import { ContactDetailsModel, ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' },
})

export class AddContactComponent implements OnInit {
  @Input() selectedContactId: string;

  contactVM: ContactDetailsModel;
  contactId: Guid;
  contactClassification: number;
  isEdit: boolean;
  filterOn: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.contactId = params.contactId;
    });
  }

  ngOnInit(): void {

  }
}