import { Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogFormResponse } from "../models/DialogFormResponse";

export class OpenDialogFormBase {
  public dialog: MatDialog;
  public closeCallback: (x) => void;
  private comp: Type<{}>;
  constructor(dialog: MatDialog, component: Type<{}>, closeCallback?: (x) => void) {
    this.dialog = dialog;
    this.comp = component;
    this.closeCallback = closeCallback;
  }
  openModal(data: any, panelClass: string = 'no-padding', backdropClass?: string, disableClose = true) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = disableClose;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = data;

    if (!backdropClass) { backdropClass = 'modal-blur'; }

    dialogConfig.backdropClass = backdropClass;

    if (panelClass) {
      dialogConfig.panelClass = panelClass;
    }

    const dialogRef = this.dialog.open(this.comp, dialogConfig);
    const sub = dialogRef.afterClosed().subscribe(result => {
      if (this.closeCallback) {
        this.closeCallback(result);
      }

      sub.unsubscribe();
    });

    if (!disableClose) {
      const sub2 = dialogRef.backdropClick().subscribe(result => {
        dialogRef.close(new DialogFormResponse(false, {}));

        sub2.unsubscribe();
      });
    }
  }

}
