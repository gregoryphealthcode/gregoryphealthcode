import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { InvoiceAddEditStoreService } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit-store.service';
import { GluEpisodeTypeEnum } from 'src/app/pages/accounts/invoice-add-edit/invoice-add-edit.service';
import { GenericResponse, GenericResponseModel } from '../../models/GenericResponseModel';
import { ProcedureCodesViewModel } from '../../models/ProcedureCodesViewModel';
import { AppMessagesService } from '../../services/app-messages.service';
import { AppointmentServicesService } from './appointment-services.service';
import { InvoiceServicesViewComponent } from './invoice-services-view/invoice-services-view.component';
import { AddInvoiceServiceRequest, AddServiceProcedureRequest, EditInvoiceServiceRequest, GetInvoiceServiceResponseModel, IGetInvoiceServiceResponseModel, InvoiceServicesService, ProcedureResponseModel } from './invoice-services.service';

@Injectable()
export class InvoiceServicesStoreService {
  constructor(
    private http: HttpClient,
    private appMessages: AppMessagesService,
  ) { }

  private currentService = new BehaviorSubject<IGetInvoiceServiceResponseModel>(undefined);
  public currentService$ = this.currentService.asObservable();

  private services = new BehaviorSubject<IGetInvoiceServiceResponseModel[]>(undefined);
  public services$ = this.services.asObservable();

  private showFee = new BehaviorSubject<boolean>(true);
  public showFee$ = this.showFee.asObservable();

  private defaultStartDate: Date | string;
  private defaultEndDate: Date | string;
  private defaultOwnerId: string;
  private parentEntityId: string;
  private defaultEpisodeTypeId: GluEpisodeTypeEnum;
  private dataService: IAddEditInvoiceService;
  private readonly newServiceId = '0';

  public get hasServices() {
    var value = false;
    if (this.services.value && this.services.value.length > 0) {
      this.services.value.forEach(service => {
        if (service.requiresProcedure) {
          if (service.procedures.length > 0 && service.fee >= 0)
            value = true;
          else
            return false;
        }
        else if (!service.requiresProcedure && service.fee >= 0)
          value = true;
      });
      return value;
    }
    else
      return false;
  }

  public setServices(appointmentServices) {
    this.services.next(appointmentServices);
  }

  public setParentEntityType(type: ServiceParentEntityType) {
    switch (type) {
      case ServiceParentEntityType.Invoice:
        this.dataService = new InvoiceServicesService(this.http)
        break;
      case ServiceParentEntityType.Appointment:
        this.showFee.next(false);
        this.dataService = new AppointmentServicesService(this.http)
        break;
      default:
        throw 'Invalid service parent entity type!'
    }
  }

  public setDefaultStartDate(date: Date) { this.defaultStartDate = date }
  public setDefaultEndDate(date: Date) { this.defaultEndDate = date }
  public setDefaultEpisodeTypeId(episodeTypeId: GluEpisodeTypeEnum) { this.defaultEpisodeTypeId = episodeTypeId }
  public setDefaultOwnerId(ownerId: string) { this.defaultOwnerId = ownerId }
  public setParentEntityId(parentEntityId: string) {
    this.parentEntityId = parentEntityId;
  }

  public onNewInvoice() {
    this.services.next(undefined);
  }

  public getAll() {
    return this.dataService.getAll(this.parentEntityId).pipe(tap(x => {
      x.forEach(y => y.showEditProcedure = y.requiresProcedure && y.procedures.length === 0);
      this.services.next(x);

      if (x.length === 0) {
        this.showAddNewService();
      }
    }));
  }

  public getProcedureCodes(searchTerms) {
    return this.dataService.getProcedureCodes(searchTerms);
  }

  public showAddNewService() {
    const startDate = this.defaultStartDate === null || this.defaultStartDate === undefined ? new Date() : this.defaultStartDate;
    const endDate = this.defaultEndDate === null || this.defaultEndDate === undefined ? startDate : this.defaultEndDate;

    const model: IGetInvoiceServiceResponseModel = {
      lineId: this.newServiceId,
      ownerId: this.defaultOwnerId,
      episodeTypeId: this.defaultEpisodeTypeId,
      startTime: startDate,
      endTime: endDate,
      description: '',
      code: '',
      units: 1,
      fee: undefined,
      requiresProcedure: false,
      procedures: []
    }

    this.currentService.next(model);
  }

  public showEditService(model: IGetInvoiceServiceResponseModel) {
    this.currentService.next(model);
  }

  public showEditProcedures(model: IGetInvoiceServiceResponseModel) {
    model.showEditProcedure = true;
  }

  public cancelEditProcedures(model: IGetInvoiceServiceResponseModel) {
    model.showEditProcedure = false;
  }


  public cancelCurrentServiceEdit() {
    this.currentService.next(undefined);
  }

  public saveService(model: IGetInvoiceServiceResponseModel) {
    if (model.lineId === this.newServiceId) {
      this.addService(model);
      return;
    }

    this.updateService(model);
  }

  private addService(model: IGetInvoiceServiceResponseModel) {
    const entity = Object.assign(new GetInvoiceServiceResponseModel(), model);
    const request = entity.toAddRequest(this.parentEntityId);

    this.dataService.addService(request)
      .pipe(
        tap(
          () => {
            this.currentService.next(undefined); 
          },
          e => this.appMessages.showApiErrorNotification(e)),
        switchMap(
          () => this.getAll()
        )
      )
      .subscribe()
  }

  private updateService(model: IGetInvoiceServiceResponseModel) {
    const entity = Object.assign(new GetInvoiceServiceResponseModel(), model);
    const request = entity.toEditRequest();

    this.dataService.updateService(request)
      .pipe(
        tap(() => this.currentService.next(undefined), e => this.appMessages.showApiErrorNotification(e)),
        switchMap(() => this.getAll()))
      .subscribe()
  }

  public getFee(model: IGetInvoiceServiceResponseModel) {
    this.dataService.getFee(this.parentEntityId, model.code, model.procedures.map(p => p.code))
      .pipe(tap(x => {
        const updatedModel: IGetInvoiceServiceResponseModel = {
          lineId: model.lineId,
          ownerId: model.ownerId,
          episodeTypeId: model.episodeTypeId,
          startTime: model.startTime,
          endTime: model.endTime,
          description: model.description,
          code: model.code,
          units: model.units,
          fee: x.data,
          requiresProcedure: model.requiresProcedure,
          procedures: model.procedures
        }
        this.currentService.next(updatedModel)
      },
        e => this.appMessages.showApiErrorNotification(e)
      ))
      .subscribe();
  }

  public updateFee(model: IGetInvoiceServiceResponseModel, fee: number) {
    this.dataService.updateFee(fee, model.lineId)
      .pipe(
        tap(() => this.currentService.next(undefined), e => this.appMessages.showApiErrorNotification(e)),
        switchMap(() => this.getAll()))
      .subscribe()
  }

  public removeService(model: IGetInvoiceServiceResponseModel) {
    this.dataService.removeService(model.lineId)
      .pipe(switchMap(() => this.getAll()))
      .subscribe()
  }

  public addProcedure(model: ProcedureResponseModel, service: IGetInvoiceServiceResponseModel) {
    const lineId = service.lineId;
    this.dataService.addProcedure({ lineId, code: model.code }).subscribe(
      x => {
        if (!service.procedures) { service.procedures = [] }

        service.procedures.push({
          id: x.data,
          description: model.description,
          code: model.code
        })
      },
      e => this.appMessages.showApiErrorNotification(e)
    )
  }

  public removeProcedure(model: ProcedureResponseModel, service: IGetInvoiceServiceResponseModel) {
    this.dataService.removeProcedure(model.id).subscribe(
      () => {
        service.procedures = service.procedures.filter(x => x.id !== model.id);
      }, e => this.appMessages.showApiErrorNotification(e)
    )
  }
}

export interface IAddEditInvoiceService {
  getProcedureCodes(code: string): Observable<ProcedureCodesViewModel[]>
  getAll(parentEntityId: string): Observable<IGetInvoiceServiceResponseModel[]>
  addService(request: AddInvoiceServiceRequest): Observable<GenericResponseModel<string>>
  updateService(request: EditInvoiceServiceRequest): Observable<GenericResponse>
  updateFee(fee: number, lineId: string): Observable<GenericResponse>
  getFee(parentEntityId: string, serviceCode: string, procedures: string[]): Observable<GenericResponseModel<number>>
  removeService(id: string): Observable<GenericResponse>
  addProcedure(request: AddServiceProcedureRequest): Observable<GenericResponseModel<string>>
  removeProcedure(id: string): Observable<GenericResponse>
}

export enum ServiceParentEntityType {
  Appointment = 'appointment',
  Invoice = 'invoice'
}
