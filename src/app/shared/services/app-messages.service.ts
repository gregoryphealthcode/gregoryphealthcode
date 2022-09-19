import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, from } from 'rxjs';
import * as swal from 'sweetalert2';
import { ApiErrorModel, ApiErrorWithRecommendationModel, parseErrorMessage } from '../helpers/api-error-helper';
import { GenericResponse } from '../models/GenericResponseModel';

export enum AppMessageType {
  ShowDashboardConfigurationPanel
}

@Injectable({
  providedIn: 'root'
})
export class AppMessagesService {
  private messages = new BehaviorSubject<AppMessageType>(undefined);
  public messages$ = this.messages.asObservable();

  constructor(private snackBar: MatSnackBar) {

  }

  public showDashboardConfigurationPanel(){
    this.messages.next(AppMessageType.ShowDashboardConfigurationPanel);
  }

  public showDeleteConfirmation(callback: () => void, text: string, titleText?: string) {
    //const text = `Are you sure you want to delete this ${entity}?`;
    let title = "Delete confirmation";
    if (titleText != undefined)
      title = titleText;

    swal.default.fire({
      position: 'top',
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        callback();
      }
    });
  }

  public showSwallError(message: string, title = 'Error') {
    swal.default.fire({
      position: 'top',
      title: title,
      text: `${message}`,
      icon: 'error'
    });
  }

  public showSwallErrorOnApiError(message: ApiErrorModel, icon: swal.SweetAlertIcon = 'error') {
    const title = message.title;
    let html = '';
    const errorsCount = message.messages.length;

    if (errorsCount > 1){
      message.messages.forEach(
        x=> {
          html+= '<div class="d-flex flex-row mb-2">'
          html+= '<span class="mr-2">&#8226;</span>'
          html+= '<div class="d-flex flex-column">'
          html+=  buildMessageError(x);
          html+='</div>';
          html+='</div>';
        }
      )
    }else{
      html= '<div class="d-flex justify-content-center">' + buildMessageError(message.messages[0]) + '</div>';
    }

    swal.default.fire({
      position: 'top',
      title,
      html,
      icon: icon
    });

    function buildMessageForErrorWithoutARecommendation(x: ApiErrorWithRecommendationModel){
      return `<span class="d-flex flex-row mb-2 text-sm-2">${x.message}</span>`
    }

    function buildMessageForErrorWithRecommendation(x: ApiErrorWithRecommendationModel){
      let error = `<span class="d-flex flex-row text-semiBold text-sm-2">${x.message}</span>`;
      error += `<div class="d-flex flex-row text-sm-2 text-left">
        <span class="text-grey-70">Recomm:&nbsp;</span>
        <span>${x.recommendation}</span>
              </div>`;
      return error;
    }

    function buildMessageError(x: ApiErrorWithRecommendationModel){
      if(x.recommendation){
        return buildMessageForErrorWithRecommendation(x);
      }
      else{
        return buildMessageForErrorWithoutARecommendation(x);
      }
    }
  }

  public showApiErrorNotification(error: any) {
    const content = parseErrorMessage(error);
    this.showSwallErrorOnApiError(content);
  }

  public showApiWarningNotification(data: GenericResponse) {
   const errors = data.errors;
    const content = new ApiErrorModel('Warning', errors);
    this.showSwallErrorOnApiError(content, 'warning');
  }

  public showAskForConfirmationModal(title: string, text: string, callback: () => void,
  cancelCallback?: () => void, confirmButtonText = 'Yes', cancelButtonText = 'No') {
      let buttonColor = 'rgb(64, 92, 157)';      

      swal.default.fire({
        position: 'top',
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: buttonColor,
        icon: 'question',
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          callback();
        } else {
          cancelCallback();
        }
      });
  }

  public showInvoiceCloseConfirmationModal(callback: () => void, cancelCallback?: () => void) {
    let buttonColor = 'rgb(64, 92, 157)';      
    let discardButtonColor = 'rgb(167, 55, 33)';

      swal.default.fire({
        position: 'top',
        title: 'Are you sure?',
        text: 'You have unsaved changed',
        confirmButtonText: 'Continue editing',
        cancelButtonText: 'Discard changes',
        confirmButtonColor: buttonColor,
        cancelButtonColor: discardButtonColor,
        icon: 'question',
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          callback();
        } else {
          cancelCallback();
        }
      });
  }

  public showInfoConfirmationModal(title: string, text: string, callback: () => void, cancelCalback?: () => void) {
    swal.default.fire({
      position: 'top',
      title,
      text,
      confirmButtonText: 'OK',
      icon: 'info',
      showCancelButton: false
    }).then((result) => {
      if (result.value) {
        callback();
      } else {
        cancelCalback();
      }
    });
  }

  public showAskForConfirmationModal$(title: string, text: string) {
    return from(swal.default.fire({
      position: 'top',
      title,
      text,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'question',
      showCancelButton: true
    }));
  }

  public showSuccessSnackBar(text: string){
    this.snackBar.open(text, "Close", {
      panelClass: "badge-success",
      duration: 3000,
    });
  }

  public showFailedSnackBar(text: string){
    this.snackBar.open(text, "Close", {
      panelClass: "badge-danger",
      duration: 3000,
    });
  }

  public showWarningSnackBar(text: string){
    this.snackBar.open(text, "Close", {
      panelClass: "badge-warning",
      duration: 3000,
    });
  }

  public showSuccessInformationModal(text: string) {
    swal.default.fire({
      position: 'top',
      title:'Success!',
      text,
      icon: 'success'
    });
  }
}
