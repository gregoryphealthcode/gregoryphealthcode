import { Component, Input, OnInit } from "@angular/core";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";
import { SubscriptionBase } from "../../base/subscribtion.base";
import { ContactService } from "../../services/contact.service";
import { RelatedPersonsViewModel } from "../../services/related-person.service";

@Component({
  selector: 'app-related-person-summary',
  templateUrl: './related-person-summary.component.html',
  styleUrls: ['./related-person-summary.component.scss']
})

@AutoUnsubscribe
export class RelatedPersonSummaryComponent extends SubscriptionBase implements OnInit {
  constructor(private contactService : ContactService) {
  super();
}
@Input() selectedRowsData : RelatedPersonsViewModel;

  ngOnInit(): void {

  }
}
