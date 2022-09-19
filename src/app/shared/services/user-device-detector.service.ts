import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserDeviceDetails } from '../models/UserDeviceDetails';

@Injectable({
  providedIn: 'root'
})
export class UserDeviceDetectorService {

  private location: any;
  private longitude = '';
  private latitude = '';

  constructor(private deviceService: DeviceDetectorService) {
    this.getLatitudeAndLongitude();
   }

  public getDeviceDetails(): UserDeviceDetails{
    return {
      clientApp: 'ePractice',
      clientVersion: '0.0.1',
      clientDevice: this.getDeviceType(),
      clientOS: this.deviceService.os,
      clientOSVersion: this.deviceService.os_version,
      clientBrowser: this.deviceService.browser,
      clientBrowserVersion: this.deviceService.browser_version,
      clientLongitude: this.longitude,
      clientLatitude: this.latitude

    }
  }

  private getLatitudeAndLongitude(){
    navigator.geolocation.getCurrentPosition(position => {
      // console.log(position);
      this.location = position.coords;
      this.longitude = position.coords.longitude.toString();
      this.latitude = position.coords.latitude.toString();
    });
  }

  private getDeviceType(): string{
    let devtype = 'Unknown';
    if (this.deviceService.isMobile() === true) {
      devtype = 'Mobile';
    } else if (this.deviceService.isTablet() === true) {
      devtype = 'Tablet';
    } else if (this.deviceService.isDesktop() === true) {
      devtype = 'Desktop';
    }
    return devtype;
  }
}
