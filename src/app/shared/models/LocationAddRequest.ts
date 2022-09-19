import { Address } from '../services/contact.service';

export class LocationAddRequest  {
  name: string;
  hcCode: string;
  siteId: string;
  address : Address;

  constructor(addLocationForm: any, siteId: string) {
    this.name = addLocationForm.locationName;
    this.hcCode = addLocationForm.hcCode;
    this.address = new Address();
    this.address.address1 = addLocationForm.address1;
    this.address.address2 = addLocationForm.address2;
    this.address.address3 = addLocationForm.address3;
    this.address.address4 = addLocationForm.address4;
    this.address.postcode = addLocationForm.postcode;
    this.siteId = siteId;
  }
}

