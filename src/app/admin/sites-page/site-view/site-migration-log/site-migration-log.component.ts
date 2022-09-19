import { Component, Input, OnInit } from '@angular/core';
import { MigrationErrorDetails, MigrationResponse, MigrationResponseModel, MigrationResponseModelPart } from '../../site-admin.service';

@Component({
  selector: 'app-site-migration-log',
  templateUrl: './site-migration-log.component.html',
  styleUrls: ['./site-migration-log.component.scss']
})
export class SiteMigrationLogComponent implements OnInit {
  @Input() migrationResponse: MigrationResponse

  constructor() { }

  ngOnInit() {
   /*  let errorDetailsArray: MigrationErrorDetails[] = [];

    for (let i = 0; i < 9; i++) {
      let errorDetails = new MigrationErrorDetails();
      errorDetails.description = "Description";
      errorDetails.error = "Error";
      errorDetailsArray.push(errorDetails);
    }

    let importData = new MigrationResponseModelPart();
    importData.successCount = 100;
    importData.errorCount = 10;
    importData.errorDetails = errorDetailsArray;

    this.migrationResponse = new MigrationResponse();

    let patients = new MigrationResponseModel();
    patients.import = importData;
    patients.addresses = importData;

    let contacts = new MigrationResponseModel();
    contacts.import = importData;

    let correspondence = new MigrationResponseModel();
    correspondence.import = importData;
    correspondence.files = importData;

    this.migrationResponse.patients = patients;
    this.migrationResponse.contacts = contacts; */
  }
}
