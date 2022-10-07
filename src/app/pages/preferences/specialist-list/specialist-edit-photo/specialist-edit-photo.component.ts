import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { FileCheckResult, FileModel, parseImageFile } from 'src/app/shared/helpers/file';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-specialist-edit-photo',
  templateUrl: './specialist-edit-photo.component.html',
  styleUrls: ['./specialist-edit-photo.component.scss']
})
export class SpecialistEditPhotoComponent implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  @ViewChild('imagePreview') imagePreview: ElementRef;
  @ViewChild('imagePreviewsmall') imagePreviewsmall: ElementRef;

  @Input() image: FileModel;

  @Output() saved: EventEmitter<FileModel> = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  uploaddocumenturl = `${environment.baseurl}/ProfilePhotos/UploadSpecialistProfilePhoto`;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  containWithinAspectRatio = false;
  uploadervalue: any[] = [];
  toolbarVisible = false;
  myphotourl = '';

  rotateLeftButtonOptions = {
    text: 'Rotate Left', icon: 'fas fa-arrow-left', hint: 'rotate counter-clockwise',
    stylingMode: 'filled', width: 'auto', type: 'default',
    disabled: false,
    onClick: () => {
      this.rotateLeft();
    }
  };

  rotateRightButtonOptions = {
    text: 'Rotate Right', icon: 'fas fa-arrow-right', hint: 'rotate clockwise',
    stylingMode: 'filled', width: 'auto', type: 'default',
    disabled: false,
    onClick: () => {
      this.rotateRight();
    }
  };

  flipHButtonOptions = {
    text: 'Flip Horizontal', icon: 'fas arrows-alt-h', hint: 'flip horizontal',
    stylingMode: 'filled', width: 'auto', type: 'default',
    disabled: false,
    onClick: () => {
      this.flipHorizontal();
    }
  };

  flipVButtonOptions = {
    text: 'Flip Vertical', icon: 'fas arrows-alt-v', hint: 'flip vertical',
    stylingMode: 'filled', width: 'auto', type: 'default',
    disabled: false,
    onClick: () => {
      this.flipVertical();
    }
  };

  constructor(
    public changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imagePreview.nativeElement.src = this.croppedImage;
    this.imagePreviewsmall.nativeElement.src = this.croppedImage;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  rotateLeft() {
    this.imageCropper.transform.rotate = this.imageCropper.transform.rotate - 90;
  }

  rotateRight() {
    this.imageCropper.transform.rotate = this.imageCropper.transform.rotate + 90;
  }

  flipHorizontal() {
    this.imageCropper.transform.flipH = !this.imageCropper.transform.flipH;
  }

  flipVertical() {
    this.imageCropper.transform.flipV = !this.imageCropper.transform.flipV;
  }

  resetImage() {
    this.imageCropper.transform.flipH = false;
    this.imageCropper.transform.flipV = false;
    this.imageCropper.transform.rotate = 0;
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  cancelPhotoClicked(e) {
    this.cancelled.emit();
  }

  fileUploaded(e) {
    const response = JSON.parse(e.request.response);
    this.changeDetectorRef.detectChanges();
  }

  fileParsedHandler(file: FileCheckResult) {
    if (file.error) {
      return;
    }

    this.saved.emit(file.file);
  }

  savePhotoClicked(e) {
    parseImageFile(this.imageCropper.imageFile, (result) => this.fileParsedHandler(result));
  }

  photoSelected(e) {
    if (e.value.length > 0) {
      const file = e.value[0];
      const fileURL = URL.createObjectURL(file);
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
}