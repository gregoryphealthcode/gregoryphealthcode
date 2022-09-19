import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorData } from '../../models/ErrorData';

@Component({
  selector: 'app-error-dial../../models/ErrorData',
  templateUrl: 'error-dialog-template.component.html',
})
export class ErrorDialogTemplateComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {
  }

  title: string;
  message: string;
  errorData: ErrorData[] = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data);

  }

  onFocusedRowChanged(e) { }
}

export interface ErrorDialogData {
  errorData: ErrorData[];
  title: string;
  message: string;
}