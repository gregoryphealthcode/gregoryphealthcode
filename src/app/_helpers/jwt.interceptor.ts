import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStore } from '../shared/stores/user.store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    UserId: string;
    constructor(userStore: UserStore) {
        this.UserId = userStore.getAuthToken();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        const myurl = request.url;

        if (myurl.includes('graph.microsoft.com')) {
            const token365 = (sessionStorage.getItem('office365Token'));
            request = request.clone({
                setHeaders: {
                    Accept: '*/*',
                    Authorization: 'Bearer ' + token365,
                }
            });
        } else
            if (myurl.includes('DownloadDocument') || myurl.includes('OLDGetPDFInvoice')) {
                const token = (sessionStorage.getItem('ePracticeToken'));
                request = request.clone({
                    setHeaders: {
                        Accept: 'application/pdf',
                        'Content-Type': 'application/pdf',
                        Authorization: 'Bearer ' + token,
                    }
                });
            } else
                if (myurl === 'https://www.uat.services.healthcode.co.uk/HCWebServices/HCWebServices' ||
                    myurl === 'https://www.services.healthcode.co.uk/HCWebServices/HCWebServices') {
                    request = request.clone({
                        setHeaders: {
                            Accept: 'text/xml, text/plain, */*',
                        }
                        // 'Content-Type': 'application/soap+xml, charset=UTF-8',
                    });

                } else
                    if (myurl.includes('Home/UploadAudio') || myurl.includes('Home/GetPDFInvoice')) {
                        request = request.clone({
                            setHeaders: {
                                Accept: 'application/pdf'
                            }, responseType: 'blob' as 'json'
                        });
                    }
        return next.handle(request);
    }
}
