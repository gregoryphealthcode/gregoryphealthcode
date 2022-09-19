import { UpdateFormOnSubmitBase } from './updateFormOnSubmit.base';
import { OnDestroy, ChangeDetectorRef, Directive, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AppInjector } from '../services/app.injector';
import { AppMessagesService } from '../services/app-messages.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { setObjectDatePropertiesToIsoString, toIsoString } from '../helpers/date-format';
import { debug } from 'console';

@Directive()
export abstract class ReactiveFormBase extends UpdateFormOnSubmitBase implements AfterViewInit,OnDestroy {
  @Output() closed = new EventEmitter();
  @Output() saved = new EventEmitter<any>();

  protected subscription = new Subscription();
  public error = '';
  public active = false;
  protected settingModel = false;
  public isNew = true;

  public model: any;
  protected showErrorModal = true;
  protected abstract httpRequest: (x: any) => Observable<any>;
  protected onSuccessfullySaved: (x: any) => void;
  protected onCloseForm: () => void; 
  protected successMessage: string;


  private errorsMap = new Map([
    ['0', x=> 'Unable to reach server. Please contact your system administrator.'],
    ['400',x=> this.parseError(x)],
    ['401',x=> 'Unauthorized. Please contact your system administrator.'],
    ['404',x=> 'Page not found. Please contact your system administrator.'],
    ['default',x=> 'Unknown error. Please contact your system administrator.'],
    ['500',x=> 'Server error. Please contact your system administrator.']
  ]);

  private spinner: SpinnerService;
  private appMessages: AppMessagesService;


  constructor() {
    super();
    const injector = AppInjector.getInjector();
    this.spinner = injector.get(SpinnerService);
    this.appMessages = injector.get(AppMessagesService);
  }


  protected listenToFormChanges() {
    this.subscription.add(this.editForm.valueChanges.subscribe(x => {
      this.model = x;
    }));
  }

  public ngAfterViewInit(){
    if (this.editForm){
      this.listenToFormChanges();
    }
  }

  public closeForm(): void {
    this.onDialogClose();
  }

  public get runChangeDetection() {
    console.log('change detection cycle');
    return '';
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  }

  public isValid = (controlName: string) => {
    const ctrl = this.editForm.controls[controlName];
    return ctrl.valid || !ctrl.touched;
  }

  public getError = (controlName: string) => {
    let error;
    const ctrl = this.editForm.controls[controlName];
    if (ctrl.errors) {
      if (ctrl.errors.required) {
        error = '* Required.';
      }
      if (ctrl.errors.email) {
        error = '* Not a valid email.';
      }
      // Todo min and maxlength
    }
    return { message: error };
  }

  public submitForm() {  
    this.onSubmit();
    if (!this.editForm.valid) {
      this.submitting = false;
      return;
    }

    this.spinner.start();
    const record = this.getModelFromForm();
    this.subscription.add(this.httpRequest(record)
      .subscribe((x: any) => {
        this.spinner.stop();
        this.submitting = false;
        if(this.onSuccessfullySaved) { this.onSuccessfullySaved(x); return;}
        if(this.successMessage){this.showSuccessMessage(this.successMessage)};
        this.saved.emit(x);
      }, (error: any) => {
        this.spinner.stop();
        this.submitting = false;
        this.onSaveError(error);
      }));
  }

  protected showSuccessMessage(successMessage: string){
    this.appMessages.showSuccessInformationModal(successMessage);
  }

  public onControlValueChanges(controlName: string, callback: (x: any) => void){
    this.editForm.get(controlName)
    .valueChanges.pipe(tap(callback))
  }

  protected addToSubscription(obs: Observable<any>){
    this.subscription.add(
      obs.subscribe()
    )
  }

  public getFormPropertyValue(controlName: string){
    return this.editForm.controls[controlName].value;
  }

  public getFormGroupControlValue(formGroup: FormGroup, controlName: string){
    return formGroup.controls[controlName].value;//
  }

  public setFormPropertyValue(controlName: string, value: any){
    this.editForm.controls[controlName].patchValue(value);
  }

  protected getModelFromForm(): any {
    const record = this.editForm.getRawValue();
    setObjectDatePropertiesToIsoString(record);
    return record;
  }

  protected populateForm(model: any) {    
    if (this.editForm) {      
      this.settingModel = true; 
      this.editForm.reset(model);
      this.editForm.markAsPristine();
      this.editForm.markAsUntouched();
    }
  }

  protected detectChanges() {
    this.settingModel = true;
    this.settingModel = false;
  }
  protected onDialogClose() {
    if(this.onCloseForm) {this.onCloseForm(); return;}
    this.closed.emit();
  }

  protected onSaveError(error: any) {
    this.error = this.buildErrorMessage(error);
    if (this.showErrorModal) {
      this.appMessages.showApiErrorNotification(error);
    }
    this.detectChanges();
  }

  private buildErrorMessage(error: any){
    const errorMessageCallback = this.errorsMap.get(error.status.toString()) || this.errorsMap.get('default');
    return errorMessageCallback(error);
  }

  private parseError(error: any): string{
    let errorMessage = 'Unable to parse error.';

    if (error.error) {
      for (const i in error.error) {
        // tslint:disable-next-line: forin
        for (const j in error.error[i]) {
          errorMessage += error.error[i][j];
        }
      }
    }

    if (error.error.message) {
      errorMessage = error.error.message;
    }

    return errorMessage;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
