import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services';

@Component({
  selector: 'app-other-preferences-add-edit',
  templateUrl: './other-preferences-add-edit.component.html',
  styleUrls: ['./other-preferences-add-edit.component.scss']
})
export class OtherPreferencesAddEditComponent extends PopupReactiveFormBase implements OnInit {
  category: string;
  uniqueNo;
  valueTypeItems = ['Text', 'Number', 'Tickbox', 'Suggest'];

  value1Type: string = "";
  value1ListTemp: Array<string> = [];
  value1Add: boolean = false;

  constructor(
    public appInfo: AppInfoService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  protected controllerName = "llu_PatientDataPoints";
  protected onOpened = (data) => {
    this.uniqueNo = data.id;
    this.category = data.category;
    this.value1ListTemp = [];

    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
  }

  setupForm() {
    this.editForm = new FormGroup({
      uniqueNo: new FormControl(this.uniqueNo),
      category: new FormControl(this.category, Validators.required),
      dataPointDescription: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      valueType: new FormControl(null, Validators.required),
      value1MaxLength: new FormControl(null, null),
      value1List: new FormControl(null, null),
      valueList1New: new FormControl(null, null),
      recordComment: new FormControl(null, null),
      alwaysAdd: new FormControl(null, null),
      active: new FormControl(null, null),
      values1: new FormArray([])
    });
  }

  getValue1FormArray() {
    return this.editForm.controls.values1 as FormArray;
  }

  populateForm(x) {
    if (x.value1List) {
      var list1 = JSON.parse(x.value1List);
      this.value1ListTemp = this.listSort(list1);
    }

    super.populateForm(x);
    const arr = this.getValue1FormArray();
    let i = 0;
    this.value1ListTemp.forEach(value => {
      let control = this.formBuilder.group((
        {
          id: i,
          value: `${value}`,
        }
      ));
      control.valueChanges.subscribe(val => {
        if (val.value == '' || val.value == null || val.value == undefined) {
          this.value1ListTemp.splice(val.id, 1);
        }
      });

      arr.push(control);
      i++;
    });

    let list = '[';

    this.value1ListTemp.forEach(value => {
      if (value != '')
        list += '"' + value + '",';
    });

    list = list.slice(0, -1)

    list += ']';

    this.editForm.patchValue({ uniqueNo: this.uniqueNo, value1List: list });
  }

  listSort(x) {
    return x.sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) { return 1; }
      return 0;
    });
  }

  saveNewValue1() {
    this.value1ListTemp.push(this.editForm.get("valueList1New").value);
    this.editForm.patchValue({ valueList1New: '' });
    this.populateControls();
  }

  populateControls() {
    this.editForm.controls.values1 = new FormArray([]);
    const arr = this.getValue1FormArray();
    let i = 0;
    this.value1ListTemp.forEach(value => {
      let control = this.formBuilder.group((
        {
          id: i,
          value: `${value}`,
        }
      ));
      arr.push(control);
      i++;
      control.valueChanges.subscribe(val => {
        if (val.value == '' || val.value == null || val.value == undefined) {
          this.value1ListTemp.splice(val.id, 1);
          this.populateControls();
        }
      });
    });
  }

  save() {
    let list = '[';
    let formArray = this.getValue1FormArray();
    for (let control of formArray.controls) {
      if (control instanceof FormGroup) {
        let value = control.value.value;

        if (value != '')
          list += '"' + value + '",';
      }
    }
    if (this.editForm.get("valueList1New").value != '' && this.editForm.get("valueList1New").value != null)
      list += '"' + this.editForm.get("valueList1New").value + '"';
    else
      list = list.slice(0, -1);
    list += ']';

    this.editForm.patchValue({ value1List: list });

    this.submitForm();
  }
}
