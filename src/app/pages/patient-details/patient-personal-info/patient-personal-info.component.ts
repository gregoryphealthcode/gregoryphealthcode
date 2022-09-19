import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { PatientTelecom } from 'src/app/shared/services';
import { PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-patient-personal-info',
  templateUrl: './patient-personal-info.component.html',
  styleUrls: ['./patient-personal-info.component.scss']
})

@AutoUnsubscribe
export class PatientPersonalInfoComponent extends SubscriptionBase implements OnInit {
  @Input() patientId: string;
  @Input() siteId: string;

  telecoms: PatientTelecom[] = [];
  allergyCount: number;
  lifestyleCount: number;
  socialCount: number;
  medicationCount: number;
  historyCount: number;
  generalCount: number;

  constructor(
    private patientService: PatientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCounts();
  }

  getCounts() {
    this.patientService.getPatientAllergyCount(this.patientId).subscribe(data => {
      this.allergyCount = data.length;
    });
    this.patientService.getPatientDataPointsCount(this.patientId).subscribe(data => {
      this.lifestyleCount = data.filter(x => x.category == 'Lifestyle').length;
      this.socialCount = data.filter(x => x.category.includes('Social')).length;
      this.medicationCount = data.filter(x => x.category.includes('Medication')).length;
      this.historyCount = data.filter(x => x.category.includes('Family')).length;
      this.generalCount = data.filter(x => x.category.includes('General')).length;
    });
  }

  updatedHandler(e) {
    this.getCounts();
  }
}