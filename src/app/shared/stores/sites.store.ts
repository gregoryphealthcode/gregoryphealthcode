import { Injectable } from '@angular/core';
import { UserAllowedSitesViewModel } from '../models/UserAllowedSitesViewModel';
import { UserStore } from './user.store';

@Injectable({
  providedIn: 'root'
})
export class SitesStore {
  private get storeKeyName() { return 'sites'; }
  private sites: UserAllowedSitesViewModel[];

  constructor(private userStore: UserStore) { }

  public setStores(stores: UserAllowedSitesViewModel[]) {
    this.store(stores);
  }

  private store(sites: UserAllowedSitesViewModel[]) {
    sessionStorage.setItem(this.storeKeyName, JSON.stringify(sites));
    this.sites = sites;
  }

  public hydrateFromStorage() {
    const userData = sessionStorage.getItem(this.storeKeyName);

    if (userData) {
      this.sites = JSON.parse(userData);
    }
  }

  public anySitesInStorage() {
    if (sessionStorage.getItem(this.storeKeyName)) {
      return true;
    }

    return false;
  }

  public clearSites() {
    sessionStorage.removeItem(this.storeKeyName);
    this.sites = [];
  }

  public getSelectedSite() {
    const selectedSitedId = this.userStore.getSiteId();
    return this.sites.find(x => x.siteId === selectedSitedId);
  }

  public getSiteRef(siteId) {
    return this.sites.find(x => x.siteId == siteId)?.siteRef;
  }
}


export enum InvoiceStatusTypes {
  Draft = 1,
  Review = 2,
  Issued = 3,
  Balanced = 4,
  Cancelled = 5,
  Error = 6,
  FailedValidation = 7,
  Passed = 8,
  Ready = 9,
  Submitted = 10,
}