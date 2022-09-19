import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { DxPopupComponent } from 'devextreme-angular';
import { AppInfoService, ScreenService, TitlesViewModel } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { take, startWith, map } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import { AuditModel, UserService } from 'src/app/shared/services/user.service';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { UserStore } from 'src/app/shared/stores/user.store';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { UserProfileViewModel, UserProfileService } from './user-profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SitesService } from 'src/app/shared/services/sites.service';
import { UserPreferencesModel } from 'src/app/shared/models/UserPreferencesModel';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class UploadProfilePhotoModel {
  PhotoFileName: string;
  PhotoBase64: any;
  UserId: string;
}

export class UpdateProfileModel {
  UserId: string;
  DisplayName: string;
  Email: string;
  Title: string;
  FirstName: string;
  LastName: string;
  ContactTel: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
@AutoUnsubscribe
export class ProfileComponent extends SubscriptionBase implements OnInit {
  @ViewChild('changePhotoPopup') changePhotoPopup: DxPopupComponent;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  @ViewChild('imagePreview') imagePreview: ElementRef;
  @ViewChild('imagePreviewsmall') imagePreviewsmall: ElementRef;

  profilephoto: UploadProfilePhotoModel;
  userprofile: UserProfileViewModel;
  colCountByScreen: object;
  profilephotourl: SafeStyle = null;
  uploadFilesValue: any[] = [];
  mySiteRef = '';
  isDropDownBoxOpened = false;
  toolbarVisible = false;
  isFileUploaded = false;
  tempUploadedFileName = '';
  preferenceModel: UserPreferencesModel = new UserPreferencesModel;
  preflabellocation = 'left';
  trackingFilter: string;
  patientTab: string;
  loadPaymentTracking = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  containWithinAspectRatio = false;
  uploadervalue: any[] = [];
  form: FormGroup;
  settingsForm: FormGroup;
  titles: TitlesViewModel[] = [];
  filteredOptions: Observable<TitlesViewModel[]>;
  myControl = new FormControl();

  rotateLeftButtonOptions = {
    text: 'Rotate Left',
    icon: 'fas fa-arrow-left',
    hint: 'rotate counter-clockwise',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default',
    disabled: false,
    onClick: () => {
      this.rotateLeft();
    }
  };

  rotateRightButtonOptions = {
    text: 'Rotate Right',
    icon: 'fas fa-arrow-right',
    hint: 'rotate clockwise',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default',
    disabled: false,
    onClick: () => {
      this.rotateRight();
    }
  };

  flipHButtonOptions = {
    text: 'Flip Horizontal',
    icon: 'fas arrows-alt-h',
    hint: 'flip horizontal',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default',
    disabled: false,
    onClick: () => {
      this.flipHorizontal();
    }
  };

  flipVButtonOptions = {
    text: 'Flip Vertical',
    icon: 'fas arrows-alt-v',
    hint: 'flip vertical',
    stylingMode: 'filled',
    width: 'auto',
    type: 'default',
    disabled: false,
    onClick: () => {
      this.flipVertical();
    }
  };

  tabOptions: Options[] = [
    { value: 'notes', viewValue: 'Notes' },
    { value: 'correspondence', viewValue: 'Correspondence' },
    { value: 'sms', viewValue: 'SMS Texts' },
    { value: 'accounts', viewValue: 'Accounts' },
    { value: 'appointments', viewValue: 'Appointments' },
    { value: 'activity', viewValue: 'Activity Log' },
    { value: 'insurers', viewValue: 'Insurers' }
  ];

  trackingOptions: Options[] = [
    { value: 'All', viewValue: 'All' },
    { value: 'balanced', viewValue: 'Balanced' },
    { value: 'issued', viewValue: 'Outstanding Payments (All)' },
    { value: 'overdue', viewValue: 'Overdue (All)' },
    { value: 'band1', viewValue: 'Band 1' },
    { value: 'band2', viewValue: 'Band 2' },
    { value: 'band3', viewValue: 'Band 3' },
    { value: 'band4', viewValue: 'Band 4' }
  ];

  constructor(
    private userStore: UserStore,
    public appInfo: AppInfoService,
    public screenService: ScreenService,
    public changeDetectorRef: ChangeDetectorRef,
    public _location: Location,
    private userService: UserService,
    private siteStore: SitesStore,
    private userProfileService: UserProfileService,
    private sanitizer: DomSanitizer,
    private siteService: SitesService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar
  ) {
    super();
    const myUrl = environment.authserverBaseurl + this.userStore.getPhotoUrl();
    this.profilephotourl = this.sanitizer.bypassSecurityTrustUrl(myUrl);
  }

  populateForm(model: UserProfileViewModel) {
    this.form.setValue({
      firstName: model.firstName,
      lastName: model.lastName,
      title: model.title,
      email: model.email,
      pin: model.pin,
      contactTel: model.contactTel,
      role: model.role,
      userType: model.userType,
      userName: model.userName,
      displayName: model.displayName
    });
    this.myControl.setValue(model.title);
  }

  private setupForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.appInfo.getEmailFormat()), Validators.maxLength(100)]),
      displayName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      title: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      pin: new FormControl(null, null),
      contactTel: new FormControl(null, null),
      role: new FormControl(null, null),
      userType: new FormControl(null, null),
      userName: new FormControl(null, null)
    });
    this.settingsForm = new FormGroup({
      loadpayment: new FormControl(null, null),
      defaultPatientTab: new FormControl(null, null),
      defaultPaymentTracking: new FormControl(null, null)
    });

  }

  public hasError = (controlName: string) => {
    return this.form.get(controlName).hasError('required');
  }

  getTitles() {
    this.subscription.add(this.siteService.getTitlesForSite().subscribe((data) => {
      this.titles = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map((value) => this._filter(value))
      );
    })
    );
  }

  private _filter(value: string): TitlesViewModel[] {
    const filterValue = value.toLowerCase();

    return this.titles.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  savePreferences() {
    this.spinnerService.start();
    this.preferenceModel.loadPaymentTracking =
      this.settingsForm.get('loadpayment').value === null ? false : this.settingsForm.get('loadpayment').value;
    this.preferenceModel.defaultPatientTab = this.settingsForm.get('defaultPatientTab').value;
    this.preferenceModel.defaultPaymentTrackingFilter = this.settingsForm.get('defaultPaymentTracking').value;
    this.subscription.add(this.userProfileService.updatePreferences(this.preferenceModel).subscribe(data => {
      this.spinnerService.stop();
      this.snackBar.open('Preferences saved successfully', 'Close', {
        panelClass: 'badge-success',
        duration: 3000
      });
    },
      error => {
        this.spinnerService.stop();
        this.snackBar.open('An error occurred', 'Close', {
          panelClass: 'badge-danger',
          duration: 3000
        });
      }));

  }

  getValues(e) {
    if (e.index === 1) {
      this.spinnerService.start();
      this.settingsForm.patchValue({ defaultPatientTab: 'notes' });
      this.subscription.add(this.userProfileService.getUserPreferenceSettings().subscribe(data => {
        this.settingsForm.patchValue({ defaultPatientTab: data.defaultPatientTab });
        this.settingsForm.patchValue({ loadpayment: data.loadPaymentTracking });
        this.settingsForm.patchValue({ defaultPaymentTracking: data.defaultPaymentTrackingFilter });
        this.spinnerService.stop();
      },
        error => {
          this.spinnerService.stop();
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: 'badge-danger',
            duration: 3000
          });
        }));
    }
  }



  populatePreferenceForm() {

  }
  cancelPhotoClicked(e) {
    this.changePhotoPopup.instance.hide();
  }

  savePhotoClicked(e) {
    this.profilephoto = {
      PhotoBase64: this.croppedImage.replace(/^data:image\/[a-z]+;base64,/, ''),
      PhotoFileName: this.userStore.getUserId() + '.PNG',
      UserId: this.userStore.getUserId()
    };

    this.subscription.add(
      this.userProfileService
        .uploadPhoto(this.profilephoto)
        .pipe(take(1))
        .subscribe(
          value => {
            console.log('uploading profile photo ok: ', value.profilePhotoUrl);
            this.profilephotourl =
              environment.authserverBaseurl +
              '/ProfilePhotos/' +
              value.profilePhotoUrl;
            notify('Profile picture updated.', 'success');
          },
          error => {
            console.log('error posting import to api: ', error);
            notify('Error uploading profile picture.', 'error');
          }
        )
    );

    this.changePhotoPopup.instance.hide();
  }

  photoSelected(e) {
    console.log('photo selected: ', e.value);
    if (e.value.length > 0) {
      const file = e.value[0];
      console.log('photo selected: ', e.value[0].name);
      const fileURL = URL.createObjectURL(file);
      console.log('file url: ', fileURL);
      this.imagePreview.nativeElement.src = fileURL;
      this.toolbarVisible = true;
      this.imageCropper.imageFile = e.value[0];
      this.showCropper = true;
      this.changeDetectorRef.detectChanges();
    } else {
      this.toolbarVisible = false;
      return '';
    }
  }

  public loadUserProfile() {
    this.subscription.add(this.userProfileService.getProfile().subscribe(x => {
      this.userprofile = x;
      this.populateForm(x);
    }));
  }

  showChangePhotoPopup() {
    this.changePhotoPopup.instance.show();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imagePreview.nativeElement.src = this.croppedImage;
    this.imagePreviewsmall.nativeElement.src = this.croppedImage;
    console.log(event);
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  rotateLeft() {
    this.imageCropper.transform.rotate =
      this.imageCropper.transform.rotate - 90;
  }

  rotateRight() {
    this.imageCropper.transform.rotate =
      this.imageCropper.transform.rotate - 90;
  }

  flipHorizontal() {
    this.imageCropper.transform.flipH = true;
  }

  flipVertical() {
    this.imageCropper.transform.flipV = true;
  }

  resetImage() {
    this.imageCropper.transform.flipH = false;
    this.imageCropper.transform.flipV = false;
    this.imageCropper.transform.rotate = 0;
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  fileUploaded(e) {
    console.log('file uploaded: ', e);
    const response = JSON.parse(e.request.response);
    console.log('response: ', response);
    console.log('file uploaded. tempfilename: ', response.tempFileName);
    this.tempUploadedFileName = response.tempFileName;
    this.isFileUploaded = true;
    this.changeDetectorRef.detectChanges();
  }

  saveProfileClicked() {
    this.userprofile.displayName = this.form.get('displayName').value;
    this.userprofile.userName = this.form.get('userName').value;
    this.userprofile.email = this.form.get('email').value;
    this.userprofile.title = this.myControl.value;
    this.userprofile.firstName = this.form.get('firstName').value;
    this.userprofile.lastName = this.form.get('lastName').value;
    this.userprofile.contactTel = this.form.get('contactTel').value;
    this.userprofile.role = this.form.get('role').value;
    this.userprofile.userType = this.form.get('userType').value;
    this.userprofile.pin = this.form.get('pin').value;

    this.subscription.add(this.userProfileService.updateProfile(this.userprofile).pipe(take(1)).subscribe(() => {
      notify('Profile Updated.', 'success');
      const auditModel: AuditModel = {
        userId: this.userStore.getUserId(),
        siteId: this.siteStore.getSelectedSite().siteId,
        eventCategory: 'Info',
        eventCode: 'ProfileUpdate',
        details: 'Profile details updated. ',
        reportedBy: 'ePractice',
        reason: '',
        patientId: null
      };
      this.userService.addAuditLog(auditModel).subscribe();
      this._location.back();
    },
      error => {
        notify('Error updating profile', 'error');
      }
    )
    );
  }

  cancelClicked() {
    this._location.back();
  }

  ngOnInit() {
    this.setupForm();
    this.getTitles();
    this.loadUserProfile();
  }
}

interface Options {
  value: string;
  viewValue: string;
}