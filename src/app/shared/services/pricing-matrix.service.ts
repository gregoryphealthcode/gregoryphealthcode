import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { GenericResponse, GenericResponseModel } from '../models/GenericResponseModel';
import Guid from 'devextreme/core/guid';
import { ResponseModel } from '../models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class PricingMatrixService {
  constructor(private http: HttpClient) {
  }

  public getServices(): Observable<NewServiceModel[]> {
    const url = `${environment.baseurl}/pricingMatrix/getServices`;
    return this.http.get<NewServiceModel[]>(url);
  }

  public getProcedures(): Observable<NewProcedureModel[]> {
    const url = `${environment.baseurl}/pricingMatrix/getProcedures`;
    return this.http.get<NewProcedureModel[]>(url);
  }

  public getPayorInsurers(): Observable<NewPayorModel[]> {
    const url = `${environment.baseurl}/pricingMatrix/getInsurerPayors`;
    return this.http.get<NewPayorModel[]>(url);
  }

  public getPayorContacts(): Observable<NewPayorModel[]> {
    const url = `${environment.baseurl}/pricingMatrix/getContactPayors`;
    return this.http.get<NewPayorModel[]>(url);
  }

  public getLocations(): Observable<NewLocationModel[]> {
    const url = `${environment.baseurl}/pricingMatrix/getLocations`;
    return this.http.get<NewLocationModel[]>(url);
  }

  public addManagedContactPayor(model: ManagedPayorModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedPayor/addContactPayor`;
    return this.http.post<GenericResponse>(url, model);
  }

  public addManagedInsurerPayor(model: ManagedPayorModel): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedPayor/addInsurerPayor`;
    return this.http.post<GenericResponse>(url, model);
  }

  public getManagedPayors(): Observable<ManagedPayorModel[]> {
    const url = `${environment.baseurl}/managedPayor/getManagedPayors`;
    return this.http.get<ManagedPayorModel[]>(url);
  }

  public getManagedServices(serviceId?: number): Observable<ManagedServiceModel[]> {
    const url = `${environment.baseurl}/managedService/getManagedServices?serviceId=${serviceId}`;
    return this.http.get<ManagedServiceModel[]>(url);
  }

  public deleteManagedService(managedServiceId: Guid): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedService/${managedServiceId}`;
    return this.http.delete<GenericResponse>(url);
  }

  public getManagedServiceLocations(): Observable<ManagedServiceLocationModel[]> {
    const url = `${environment.baseurl}/managedServiceLocation/getManagedServiceLocations`;
    return this.http.get<ManagedServiceLocationModel[]>(url);
  }

  public getManagedServicePayors(): Observable<ManagedServicePayorModel[]> {
    const url = `${environment.baseurl}/managedServicePayor/getManagedServicePayors`;
    return this.http.get<ManagedServicePayorModel[]>(url);
  }

  public addManagedServicePayor(managedServiceId: number, managedPayorId: Guid, price: number | null): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedServicePayor/addManagedServicePayor`;
    return this.http.post<GenericResponse>(url, { managedServiceId, managedPayorId, price });
  }

  public editManagedServicePayor(managedServicePayorId: Guid, price: number | null): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedServicePayor/editManagedServicePayor`;
    return this.http.put<GenericResponse>(url, { managedServicePayorId, price });
  }

  public getManagedServicePayorLocations(serviceId: number): Observable<ManagedServicePayorLocationModel[]> {
    const url = `${environment.baseurl}/managedServicePayorLocation/getManagedServicePayorLocations?managedServiceId=${serviceId}`;
    return this.http.get<ManagedServicePayorLocationModel[]>(url);
  }

  public addManagedServicePayorLocation(managedServiceId: number, managedPayorId: Guid, locationId: Guid, price: number | null): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedServicePayorLocation/addManagedServicePayorLocation`;
    return this.http.post<GenericResponse>(url, { managedServiceId, managedPayorId, locationId, price });
  }

  public editManagedServicePayorLocation(managedServicePayorLocationId: Guid, price: number | null): Observable<GenericResponse> {
    const url = `${environment.baseurl}/managedServicePayorLocation/editManagedServicePayorLocation`;
    return this.http.put<GenericResponse>(url, { managedServicePayorLocationId, price });
  }

  public getMultiProcedureSets(): Observable<GenericResponseModel<MultiProcedureSetModel[]>> {
    const url = `${environment.baseurl}/multiProcedures/getSets`;
    return this.http.get<GenericResponseModel<MultiProcedureSetModel[]>>(url);
  }

  public getMultiProcedureSetDetails(setId: string): Observable<GenericResponseModel<MultiProcedureSetDetailModel[]>> {
    const url = `${environment.baseurl}/multiProcedures/getSetDetails?setId=${setId}`;
    return this.http.get<GenericResponseModel<MultiProcedureSetDetailModel[]>>(url);
  }

  public getManagedPayorServicePrices(payorId: string, serviceId: number): Observable<EditManagedServicePayorModel> {
    const url = `${environment.baseurl}/managedPayor/getManagedPayorServicePrices?payorId=${payorId}&&serviceId=${serviceId}`;
    return this.http.get<EditManagedServicePayorModel>(url);
  }

  public getEstvPayorServicePriceDetails(payorId: string, serviceId: number): Observable<GenericResponseModel<EstvPriceDetailsModel>> {
    const url = `${environment.baseurl}/managedServicePayor/getEstvPayorServicePriceDetails?payorId=${payorId}&&serviceId=${serviceId}`;
    return this.http.get<GenericResponseModel<EstvPriceDetailsModel>>(url);
  }

  public updatePayorServicePrices(model: EditManagedServicePayorModel): Observable<ResponseModel> {
    const url = `${environment.baseurl}/managedServicePayor/updateManagedPayorServicePrices`;
    return this.http.post<ResponseModel>(url, model);
  }
}

export class MultiProcedureSetModel {
  setId: string;
  description: string;
}

export class MultiProcedureSetDetailModel {
  proceduresCount: string;
  procedures: ProceduresDetailsModel[];
}

export class ProceduresDetailsModel {
  groupProceduresCount: string;
  index: string;
  percentage: string;
  value: string;
}

export class NewPayorModel {
  id?: Guid | null;
  name?: string | null;
  type?: string | null;
}

export class NewServiceModel {
  serviceCode?: string | null;
  description?: string | null;
  procedures?: string[] | null;
}

export class NewProcedureModel {
  code?: string | null;
  description?: string | null;
}

export class NewLocationModel {
  locationId?: Guid | null;
  locationName?: string | null;
}

export class ManagedPayorModel {
  payorId?: Guid | null;
  payorName?: string | null;
  logoUrl?: string | null;
  isStv?: boolean | null;
}

export class ManagedServiceModel {
  serviceId?: number | null;
  serviceDescription?: string | null;
}

export class ManagedServicePayorModel {
  managedServicePayorId?: Guid | null;
  managedServiceId?: number | null;
  managedPayorId?: Guid | null;
  price: number | null;
}

export class ManagedServiceLocationModel {
  locationId?: Guid | null;
  locationName?: string | null;
}

export class ManagedServicePayorLocationModel {
  managedServicePayorLocationId?: Guid | null;
  managedServiceId?: number | null;
  managedPayorId?: Guid | null;
  locationId?: Guid | null;
  price: number | null;
}

export class EditManagedServicePayorModel {
  servicePrice: ManagedServicePayorModel;
  locationPrices: ManagedServicePayorLocationModel[];
}

export class EstvPriceDetailsModel {
  minPrice?: number | null;
  maxPrice?: number | null;
  medianPrice?: number | null;
  highPrice?: number | null;
  narrativeMessage: string;
  warningMessage: string;
  rejectMessage: string;
  optionMessage: string;
}