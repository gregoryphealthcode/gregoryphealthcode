import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { _wrapModelInObservable } from '@devexpress/analytics-core/analytics-internal';
import Guid from 'devextreme/core/guid';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { DataPointItemsModel, PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-patient-lifestyle-edit',
  templateUrl: './patient-lifestyle-edit.component.html',
  styleUrls: ['./patient-lifestyle-edit.component.scss']
})
export class PatientLifestyleEditComponent extends SubscriptionBase implements OnInit {
  constructor(
    private patientService: PatientService
  ) {
    super();
  }

  @Input() dataPointId: Guid;
  @Input() patientId: Guid;
  @Input() category: string;
  @Input() isEdit: boolean;

  @Output() closePopup = new EventEmitter<boolean>();

  editForm: FormGroup;
  dataPoint: DataPointItemsModel = new DataPointItemsModel();
  dataPoints: DataPointItemsModel[] = new Array<DataPointItemsModel>();
  value1List: [];
  submitting = false;
  
  ngOnInit() {
    this.getDataPoints();
    this.setupForm();
    if (this.isEdit) {
      this.populateForm();
    }

    this.subscription.add(this.editForm.get('dataItemType')
      .valueChanges.subscribe((x) => this.typeChanged(x)));
  }

  setupForm() {
    this.editForm = new FormGroup({
      dataItemType: new FormControl(null, [Validators.required]),
      value1Text: new FormControl(null, null),
      value1Number: new FormControl(null, null),
      value1Tick: new FormControl(null, null),
      value1List: new FormControl(null, null),
      comment: new FormControl(null, null),
    });
  }

  getDataPoints() {
    this.patientService.getDataPointItems(this.category).subscribe(x => {
      this.dataPoints = x.filter(y => y.category == this.category);
      this.dataPoints.sort(function (a, b) {
        if (a.value1Description < b.value1Description) return -1;
        if (a.value1Description > b.value1Description) return 1;
        return 0;
      })
    });
  }

  populateForm() {
    this.patientService.getPatientDataPointDetails(this.dataPointId).subscribe(x => {
      this.dataPoint = x;
      if (x.value1List != null) {
        var list1 = JSON.parse(x.value1List);
        if (list1.length > 0)
          this.value1List = this.listSort(list1);
      }

      this.editForm.patchValue({ dataItemType: x.value1Description });
      this.populateType(x.value1Type, 1, x.value1Value);
      this.editForm.patchValue({ comment: x.comment });
    });
  }

  populateType(type: string, position: number, value: string) {
    switch (type) {
      case "Number":
        this.editForm.patchValue({ value1Number: value });
        break;
      case "Suggest":
        this.editForm.patchValue({ value1List: value });
        break;
      case "Text":
        this.editForm.patchValue({ value1Text: value });
        break;
      case "Tickbox":
        var boolValue = (value == "true");
        this.editForm.patchValue({ value1Tick: boolValue });
        break;
    }
  }

  typeChanged(e) {
    if (e != null) {
      this.dataPoint = this.dataPoints.find(x => x.value1Description == e);

      switch (this.dataPoint.value1Type) {
        case "Number":
          this.editForm.get('value1Number').setValidators(Validators.required);
        break;        
      case "Suggest":
        this.editForm.get('value1List').setValidators(Validators.required);
        break;
      case "Text":
        this.editForm.get('value1Text').setValidators([Validators.required, Validators.maxLength(50)]);
        break;
      case "Tickbox":        
        this.editForm.get('value1Tick').setValidators(Validators.required);
        break;
      }

      if (this.dataPoint.value1List != null) {
        var list1 = JSON.parse(this.dataPoint.value1List);
        this.value1List = this.listSort(list1);
      }
    }
    else
      this.dataPoint = null;
  }

  listSort(x) {
    return x.sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) { return 1; }
      return 0;
    });
  }

  submitForm() {
    this.submitting = true;
    var model = new DataPointItemsModel();
    if (this.isEdit)
      model.dataPointId = this.dataPointId;
    model.patientId = this.patientId;
    model.category = this.category;
    model.value1Description = this.dataPoint.value1Description;
    model.value1Value = this.getValues(this.dataPoint.value1Type, 1).toString();
    if (this.dataPoint.recordComment) {
      model.comment = this.editForm.get("comment").value;
    }
    if (this.isEdit)
      this.patientService.updatePatientDataPoint(model).subscribe(x => {
        if (x.success) {
          this.closePopup.emit(true);
        }
        else {
          this.closePopup.emit(false);
        }
        this.submitting = false;
      });
    else
      this.patientService.addPatientDataPoint(model).subscribe(x => {
        if (x.success) {
          this.closePopup.emit(true);
        }
        else {
          this.closePopup.emit(false);
        }
        this.submitting = false;
      });
  }

  getValues(type: string, position: number) {
    switch (type) {
      case "Number":
        return this.editForm.get('value1Number').value;
      case "Suggest":
        return this.editForm.get('value1List').value;
      case "Text":
        return this.editForm.get('value1Text').value;
      case "Tickbox":
        return this.editForm.get('value1Tick').value;
    }
  }
}
