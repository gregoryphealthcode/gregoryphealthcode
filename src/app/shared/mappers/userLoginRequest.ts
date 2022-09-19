import { UserDeviceDetails } from '../models/UserDeviceDetails';
import { UserLoginRequest } from '../models/UserLoginRequest';

export const buildLoginRequest
= (userName: string, password: string, deviceDetails: UserDeviceDetails): UserLoginRequest => {
 return {
   username: userName,
   password,
   clientApp: deviceDetails.clientApp,
   clientVersion: deviceDetails.clientVersion,
   clientDevice: deviceDetails.clientDevice,
   clientOS: deviceDetails.clientOS,
   clientOsVersion: deviceDetails.clientOSVersion,
   clientBrowser: deviceDetails.clientBrowser,
   clientBrowserVersion: deviceDetails.clientBrowserVersion,
   clientLongitude: deviceDetails.clientLongitude,
   clientLatitude: deviceDetails.clientLatitude,
 }
};
