import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { TaskTypeModel, BillingService, } from 'src/app/shared/services/billing.service';
import { PatientAccountsViewModel, PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-patient-tasks-add-edit',
  templateUrl: './patient-tasks-add-edit.component.html',
  styleUrls: ['./patient-tasks-add-edit.component.scss']
})
export class PatientTasksAddEditComponent extends PopupReactiveFormBase implements OnInit {
  public patientId: string;
  public invoices: PatientAccountsViewModel[] = [];
  public taskTypes: TaskTypeModel[] = [];
  public min;

  constructor(
    private formBuilder: FormBuilder,
    private billingService: BillingService,
    private patientService: PatientService,
    public appInfo: AppInfoService
  ) {
    super();
  }

  protected controllerName = "patientTasks";
  protected onOpened = (data) => {
    this.patientId = data.patientId;

    this.getInvoices();
    this.getInvoiceTaskTypes();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
    this.getInvoiceTaskTypes();
    this.setupForm();
  }

  getInvoices() {
    this.patientService.getAccounts(this.patientId).subscribe(data => {
      this.invoices = data;
    });
  }

  getInvoiceTaskTypes() {
    this.billingService.getInvoiceTaskTypes().subscribe(data => {
      this.taskTypes = data;
    });
  }

  private setupForm() {
    this.editForm = this.formBuilder.group({
      id: new FormControl(null),
      patientId: new FormControl(this.patientId),
      invoiceId: new FormControl(null, Validators.required),
      taskTypeId: new FormControl(null, Validators.required),
      note: new FormControl(null),
      dueDateTime: new FormControl(new Date(), Validators.required),
      isCompleted: new FormControl(false),
    });

    this.subscription.add(this.editForm.get('invoiceId').valueChanges.subscribe(x => {
      this.min = this.invoices.find(y => y.invoiceId == x)?.invoiceDate;
      this.editForm.patchValue({ dueDateTime: this.min });
    }));
  }
}