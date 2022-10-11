import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-letters-documents',
  templateUrl: './patient-letters-documents.component.html',
  styleUrls: ['./patient-letters-documents.component.scss']
})
export class PatientLettersDocumentsComponent implements OnInit {
  constructor() { }

  @Input() patientId: string;
 
  newDictation = false;
  documentId: string;
  tabIndex = 0;  

  ngOnInit() {
  }

  changeTabHandler(e) {
    this.tabIndex = 0;
    this.documentId = e;
    this.newDictation = true;
  }  
}
