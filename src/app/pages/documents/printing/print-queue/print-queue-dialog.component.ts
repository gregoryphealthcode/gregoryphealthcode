import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'print-queue-dialog',
  templateUrl: 'print-queue-dialog.html',
})
export class PrintQueueDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PrintQueueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrintQueueDialogData
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface PrintQueueDialogData {
  isAll: boolean;
  isPatientZone: boolean;
}