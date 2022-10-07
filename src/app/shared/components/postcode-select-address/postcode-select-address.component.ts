import { Component, ViewChild, Pipe, PipeTransform,
  ChangeDetectionStrategy, EventEmitter, Output, Input, ChangeDetectorRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DxTextBoxComponent,
  DxDropDownBoxComponent, DxFormComponent,

} from 'devextreme-angular';
import { Observable } from 'rxjs';
import { take} from 'rxjs/operators';
import { Router} from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AppInfoService, ScreenService } from 'src/app/shared/services';

import Guid from 'devextreme/core/guid';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { environment } from 'src/environments/environment';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

export class AddressSearchModel {
  SiteId: Guid;
  UserId: Guid;
  SearchTerm: string;
  UserContext: string;
}


export class SearchAddressModel {
  SiteId: Guid;
  UserId: Guid;
  SearchFor: string;
  PatientText: string;
}

@Component({
  selector: 'app-postcode-select-address',
  templateUrl: './postcode-select-address.component.html',
  styleUrls: ['./postcode-select-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe
export class PostcodeSelectAddressComponent {
  @Input() isInPopup: boolean;
  @Input() searchFor: string;
  @ViewChild('selectaddressform') selectAddressForm: DxFormComponent;
  @ViewChild('searchTerm') searchTerm: DxTextBoxComponent;
  @ViewChild('addressDropdown') addressDropdown: DxDropDownBoxComponent;
  @Output() selectAddressFormClosed = new EventEmitter<boolean>();
  @Output() selectAddressFormOK = new EventEmitter<boolean>();
  @Input() postCode: string;
  @Input() isInPopUp: boolean;

  public selectedAddress: any;
  issmallscreen = false;
  isDropDownBoxOpened = false;
  public showPostcodeData: boolean;
  public postcodeData: string;
  public addressMatches: any[];
  public numMatches: number;
  jsonData: any;

  public selectAddressData: any = {
    searchTerm: '', selectedAddress: '', AddressLine1: '', AddressLine2: '', AddressLine3: '', AddressLine4: '', Latitude: '', Longitude: ''
  };

  AddressMapButtonOptions: any = {
    text: 'show on map',
    type: 'default',
    useSubmitBehavior: false,
    icon: 'fas fa-map-marker-alt',
    hint: 'Show address on map.',
    elementAttr: { id: 'mapBtn', class: 'SmallMapButton', style: 'margin-left:auto; margin-right:auto;' },
    onClick: (event) => {
      // this.mappopup.instance.show();
      // console.log('Map displayed...  lat:', this.patient.patientAddresses[0].latitude,
      //   ' - long: ', this.patient.patientAddresses[0].longitude);
      // const mapProperties = {
      //   center: new google.maps.LatLng(
      //     parseFloat(this.patient.patientAddresses[0].latitude.toString()),
      //     parseFloat(this.patient.patientAddresses[0].longitude.toString())),
      //   zoom: 9,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP,
      // };
      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
      // const marker = new google.maps.Marker({
      //   position: {
      //     lat: parseFloat(this.patient.patientAddresses[0].latitude.toString()),
      //     lng: parseFloat(this.patient.patientAddresses[0].longitude.toString())
      //   },
      //   map: this.map, title: 'Patient'
      // });
    }
  };
  newAddressSearch: any = {
    siteId: '',
  };

  screensize: any;
  preflabellocation = 'left';

  searchButton: any;

  allCaps(e) {
    let textcontent = e.component._$textEditorInputContainer[0].firstChild.value;
    textcontent = textcontent.toUpperCase();
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  onFormSubmit(e) {
    console.log('form submitted');
  }


  getDisplayAddress(item) {
    if (item === null || item === undefined) { return ''; }
    return item.line_1 + ', ' + item.line_2 + ', ' + item.line_3;
  }

  addressSelectChange(e) {
    console.log('addressSelect - e: ', e);
    this.selectedAddress = {
      AddressLine1:  e.selectedItem.line_1,
      AddressLine2: e.selectedItem.line_2,
      AddressLine3: e.selectedItem.line_3,
      AddressLine4: e.selectedItem.post_town,
      Longitude: e.selectedItem.longitude,
      Latitude: e.selectedItem.latitude
    };
    // this.selectAddressData = {
    //   AddressLine1:  e.selectedItem.line_1,
    //   AddressLine2: e.selectedItem.line_2,
    //   AddressLine3: e.selectedItem.line_3,
    //   AddressLine4: e.selectedItem.post_town,
    //   Longitude: e.selectedItem.longitude,
    //   Latitude: e.selectedItem.latitude
    // };
    // this.selectAddressForm.instance.updateData(this.selectAddressData);
    this.selectAddressForm.instance.updateData('AddressLine1', e.selectedItem.line_1);
    this.selectAddressForm.instance.updateData('AddressLine2', e.selectedItem.line_2);
    this.selectAddressForm.instance.updateData('AddressLine3', e.selectedItem.line_3);
    this.selectAddressForm.instance.updateData('AddressLine4', e.selectedItem.post_town);
    this.selectAddressForm.instance.updateData('Longitude', e.selectedItem.longitude);
    this.selectAddressForm.instance.updateData('Latitude', e.selectedItem.latitude);
  }

  public getAddresses(myaddresssearchmodel: AddressSearchModel): Observable<any> {
    const url = `${environment.baseurl}/address/getaddresses`;
    //const options = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.userStore.getAuthToken() }};
    return this.http.post<any>(url, myaddresssearchmodel);
  }

  public postcodeCheck(mypostcode: string): Observable<any> {
    const url = `${environment.baseurl}/address/postcodevalid/` + mypostcode;
    const options = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.userStore.getAuthToken() }};
    return this.http.get<any>(url, options);
  }

  checkPostcodeValid(myPostcode): boolean {
    let flg = true;
    this.postcodeCheck(myPostcode).subscribe(value => {
      // console.log('checkPostcodeValid - status: ', value.status);
      const tempData = value.result;
      if (value.result !== 200) { flg = false; }
      // console.log('checkPostcodeValid - result: ', tempData);
      this.showPostcodeData = true;
      this.postcodeData = 'Postcode: ' + tempData.postcode + '\r\n';
      this.postcodeData += 'Strategic Health Authority: ' + tempData.nhs_ha + '\r\n';
      this.postcodeData += 'Primary Care Trust (PCT): ' + tempData.primary_care_trust + '\r\n';
      this.postcodeData += 'Clinical Commissioning Group: ' + tempData.ccg ;
      this.changeDetectorRef.detectChanges();
    }, error => {
      this.showPostcodeData = false;
      this.postcodeData = '';
      flg = false;
    });
    return flg;
  }

  public addressSearch() {
    console.log('address search clicked.');
    // use free postcode check service to determine valid BEFORE looking up the address & incurring token charges!
    let myPostcode:string = '';
    try {
      this.selectAddressForm.instance.getEditor('searchTerm').option('text');
    } catch(e) {}
    const selectedSite = this.siteStore.getSelectedSite();
    console.log('address search on postcode: ', myPostcode);
    if (this.checkPostcodeValid(myPostcode)) {
      const myAddressSearch = new AddressSearchModel();
      myAddressSearch.UserId = this.userStore.getUserId();
      myAddressSearch.SearchTerm = myPostcode;
      myAddressSearch.UserContext = selectedSite.siteRef;
      this.getAddresses(myAddressSearch)
          .pipe(take(1))
          .subscribe(value => {
        // console.log('result:', value.result);
        const jsonAddresses = JSON.parse(value.addressresponse);
        // console.log('json:', jsonAddresses );
        const addresses: any[] = jsonAddresses.result;
        try {
          if (value.result === 'Success') {
            this.numMatches = addresses.length;
            this.addressMatches = addresses;
            notify('' + this.numMatches.toString() + ' possible addresses found.', 'success');
            this.changeDetectorRef.detectChanges();

          }
        } catch {
          console.log('error processing reponse.');
        }

      }, error => {
        console.log('error getting addresses from api: ', error);
        notify('Error obtaining addresses.', 'warning');
      });
    } else {
      notify('Not a valid postcode.', 'Warning');
    }
  }

  cancelClicked(e) {
    console.log('cancel clicked');
    this.selectAddressFormClosed.emit(true);

  }

  selectAddressOKClicked(e) {
    console.log('OK clicked');
    this.selectAddressFormOK.emit(true);
  }

  constructor(private userStore: UserStore,
              public appInfo: AppInfoService,
              private http: HttpClient, public router: Router,
              public _location: Location, public screenService: ScreenService,
              private changeDetectorRef: ChangeDetectorRef,
              private siteStore: SitesStore) {
    this.screensize = screenService.sizes;

    this.numMatches = 0;
    this.showPostcodeData = false;
    this.postcodeData = '';

    if (this.screenService.sizes['screen-small'] || this.screenService.sizes['screen-x-small']) {
      // this.preflabellocation = 'top';
      this.issmallscreen = true;
    }

    this.searchButton = {
      icon: 'fas fa-search',
      type: 'default',
      hint: 'Search for patient',
      onClick: (event) => {
        this.addressSearch();
      }
    };
  }

  selectAddressFormShown(searchFor) {
    console.log('select address form shown: ', searchFor);
    setTimeout(() => {
      // try {
        this.searchTerm.instance.focus();
        if (searchFor !== null && searchFor !== '') {
          console.log('setting searchTerm to:', searchFor);
          this.selectAddressForm.instance.getEditor('searchTerm').option('text', searchFor);
          this.selectAddressForm.instance.getEditor('searchTerm').option('value', searchFor);
          this.selectAddressData.searchTerm = searchFor;
          this.changeDetectorRef.detectChanges();
          this.addressSearch();
        }
      // } catch { }
    }, 750);

  }


}



