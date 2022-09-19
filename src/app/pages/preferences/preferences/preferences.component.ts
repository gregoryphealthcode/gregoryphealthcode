import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  host: { class: 'd-flex flex-row flex-grow-1' }
})
export class PreferencesComponent implements OnInit {

  public items = [
    {
      icon: 'fa-cog', title: 'Site', path: 'site', active: true,
      description: 'Selected site preferences'
    },
    {
      icon: 'fa-calendar-alt', title: 'Appointments', path: 'appointments', active: true,
      description: 'Appointment preferences'
    },
    {
      icon: 'fa-stethoscope', title: 'Practitioners', path: 'practitioners',
      description: 'Practitioner preferences'
    },
    {
      icon: 'fa-user-injured', title: 'Patients', path: 'patient-details',
      description: 'Patient details preferences'
    },
    {
      icon: 'fa-address-card', title: 'Contacts', path: 'contact',
      description: 'Contact preferences'
    },
    {
      icon: 'fa-tools', title: 'Documents', path: 'documents',
      description: 'Document type preferences'
    },
    {
      icon: 'fa-pound-sign', title: 'Accounts', path: 'accounts',
      description: 'Accounts preferences'
    },
    {
      icon: 'fa-file-invoice', title: 'Templates', path: 'templates',
      description: 'Templates preferences'
    },
    {
      icon: 'fa-cog', title: 'Integrations', path: 'integration-services',
      description: 'Integration Services preferences'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
