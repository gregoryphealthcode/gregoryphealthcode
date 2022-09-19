import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { FileCheckResult, FileModel, parseFile } from 'src/app/shared/helpers/file';
import { requiredIfValidator } from 'src/app/shared/helpers/form-helper';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { GlobalTemplateTypesModel, TemplateFileModel, TemplateService, GlobalTemplateViewModel, GlobalTemplateCategoryModel } from 'src/app/shared/services/template.service';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-global-template-add-edit',
  templateUrl: './global-template-add-edit.component.html',
  styleUrls: ['./global-template-add-edit.component.scss']
})
export class GlobalTemplateAddEditComponent extends PopupReactiveFormBase implements OnInit {
  templateCategories: GlobalTemplateCategoryModel[] = [];
  templateTypes: GlobalTemplateTypesModel[] = [];
  uploadFilesValue: any[] = [];
  tempFileNames: FileModel[] = [];
  template: GlobalTemplateViewModel;
  category;
  newUpload = false;
  url;
  error;
  base64String;

  constructor(
    private templateService: TemplateService,
    private userStore: UserStore,
    private domSanitizer: DomSanitizer, public appInfo: AppInfoService
  ) {
    super();
  }

  protected controllerName = "glu_Templates";
  protected onOpened = (data) => {
    this.uploadFilesValue = [];
    this.tempFileNames = [];

    this.getTemplateCategories();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  getTemplateCategories() {
    this.templateService.getGlobalTemplateCategories().subscribe(data => {
      this.templateCategories = data;
      this.templateCategories.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    })
  }

  getTemplateTypes(category) {
    this.templateService.getGlobalTemplateTypes(category).subscribe(data => {
      this.templateTypes = data;
      this.templateTypes.sort(function (a, b) {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
    })
  }

  setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(null),
      templateCategory: new FormControl(null, requiredIfValidator(() => this.isNew)),
      typeId: new FormControl(null, requiredIfValidator(() => this.isNew)),
      file: new FormControl(null),
      description: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      comments: new FormControl(null, Validators.maxLength(500)),
      isPatientZone: new FormControl(false),
      active: new FormControl(true),
    })

    this.editForm.get('templateCategory').valueChanges.subscribe(x => {
      this.category = x;

      if (this.category) {
        this.getTemplateTypes(this.category);
      }
    });
  }

  protected populateForm(x) {
    this.template = x;

    if (this.isNew)
      this.newUpload = true;
    super.populateForm(x);
  }

  fileUploaded(e) {
    if (e.value.length == 0) {
      this.uploadFilesValue = [];
      this.editForm.patchValue({ fileName: "" });
      this.editForm.patchValue({ fileType: "" });
      this.editForm.patchValue({ mimeType: "" });
      this.editForm.patchValue({ fileBase64String: "" });
    }
    if (e.value.length > 0) {
      e.value.forEach(element => {
        const extension = element.name.split('.')[1];
        if (extension != "doc" && extension != "docx") {
          this.uploadFilesValue.splice(this.uploadFilesValue.length - 1, 1);
          return;
        }
        const file = element;
        parseFile(file, result =>
          this.fileUploadHandler(result));
      });
    }
  }

  removeFile(e) {
    this.uploadFilesValue = [];
  }

  deleteFile() {
    this.newUpload = true;
    this.url = null;
    this.uploadFilesValue = [];
    this.editForm.patchValue({ file: null });
  }

  fileUploadHandler(result: FileCheckResult) {
    this.tempFileNames.push(result.file);

    let file = new TemplateFileModel();
    file.name = this.uploadFilesValue[0].name;
    file.contentBase64String = result.file.fileAsBase64String;
    this.editForm.patchValue({ file: file });
  }

  uploadheaders() {
    return ({
      Authorization: 'Bearer ' + this.userStore.getAuthToken(),
      enctype: 'multipart/form-data',
      UserId: this.userStore.getUserId(),
      Client: 'ePractice'
    });
  }

  getFileExtension(fname) {
    return fname.substr((fname.lastIndexOf('.') + 1));
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  downloadFile() {
    var blob = this.b64toBlob(this.template.file.contentBase64String);
    saveAs(blob, this.template.file.name);
  }

  b64toBlob: any = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
