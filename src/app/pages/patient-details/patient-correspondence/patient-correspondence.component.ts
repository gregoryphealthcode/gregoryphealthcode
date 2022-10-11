import { Component, Input, OnInit } from "@angular/core";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";

@Component({
  selector: 'app-patient-correspondence',
  templateUrl: './patient-correspondence.component.html',
  styleUrls: ['./patient-correspondence.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

export class PatientCorrespondenceComponent extends SubscriptionBase implements OnInit {
  constructor() {
    super();
  }

  @Input() patientId: string;
  @Input() patientName: string;

  ngOnInit() {
  }
}

export interface CorrespondenceDetail { id; date; comment; category; document_file; sent_or_received; downloadurl; }