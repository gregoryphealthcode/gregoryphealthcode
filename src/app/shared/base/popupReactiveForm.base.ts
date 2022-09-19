import { HttpClient } from "@angular/common/http";
import { Directive, Input } from "@angular/core";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AppInjector } from "../services/app.injector";
import { ReactiveFormBase } from "./reactiveForm.base";
import { of } from 'rxjs';

@Directive()
export abstract class PopupReactiveFormBase extends ReactiveFormBase {
  @Input()
  public set data(value){
    if(value){
      this.onOpened(value);
    }
  }
  public get data(){ return this._data;}
  private _data: any;

  public show: boolean;

  private controllerUrl: string;
  private httpClient: HttpClient;

  protected abstract onOpened: (data: any) => void;
  protected abstract controllerName: string;
  protected httpRequest = x => of({});

  constructor() {
    super()
    const injector = AppInjector.getInjector();
    this.httpClient = injector.get(HttpClient);
  }

  private setUrl(controllerName){
    this.controllerUrl = `${environment.baseurl}/${controllerName}`;
  }

  protected setup(data: any){
    this.setUrl(this.controllerName);
    this.isNew = data.id === 0 || data.id === '00000000-0000-0000-0000-000000000000';
    this._data = data;

    if (!this.isNew) {
      this.httpRequest = x=> this.httpClient.put(this.controllerUrl, x);      
      this.getRecord(data.id);
    } else {
      this.httpRequest = x=> this.httpClient.post(this.controllerUrl, x);      
      this.populateForm(data);
      this.show = true;
    }

    this.onSuccessfullySaved = x => {
      this.show = false;
      this.saved.emit(x)
    }
  }

  private getRecord(id: any) {
    const url = `${this.controllerUrl}/${id}`;

    this.subscription.add(
      this.httpClient.get(url).pipe(
        tap((value) => {
          this.show = true;
          this.populateForm(value);
        })
      ).subscribe()
    )
  }

  public closeForm(){
    this.show = false;
    super.closeForm();
  }
}
