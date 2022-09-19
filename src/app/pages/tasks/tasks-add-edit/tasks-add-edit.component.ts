import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DxPopupComponent } from 'devextreme-angular';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { AppInfoService } from 'src/app/shared/services/app-info.service';
import { TaskTypeModel, BillingService } from 'src/app/shared/services/billing.service';
import { PatientAccountsViewModel, PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-tasks-add-edit',
  templateUrl: './tasks-add-edit.component.html',
  styleUrls: ['./tasks-add-edit.component.scss']
})
export class TasksAddEditComponent extends PopupReactiveFormBase implements OnInit {
  @Input() fromPatient: boolean;
  public patientId: string;
  public invoices: PatientAccountsViewModel[] = [];
  public taskTypes: TaskTypeModel[] = [];
  public min = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private billingService: BillingService,
    private patientService: PatientService,
    public appInfo: AppInfoService,
  ) {
    super();
  }

  protected controllerName = "invoiceTasks";
  protected onOpened = (data) => {
    this.patientId = data.patientId;

    this.getInvoiceTaskTypes();
    this.setupForm();
    this.setup(data);
  };

  ngOnInit() {
  }

  protected populateForm(model: any): void {
    this.patientId = model.patientId;
    this.getInvoices();
    super.populateForm(model);
  }

  getInvoices() {
    if (this.patientId)
      this.patientService.getAccounts(this.patientId).subscribe(data => {
        this.invoices = data;
        this.invoices = this.invoices.filter(x => x.status != 'Cancelled')
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
      patientId: new FormControl(null, Validators.required),
      patientName: new FormControl(null),
      payorId: new FormControl(null, Validators.required),
      payorName: new FormControl(null),
      invoiceId: new FormControl(null),
      taskTypeId: new FormControl(null, Validators.required),
      note: new FormControl(null),
      dueDateTime: new FormControl(null, Validators.required),
      isCompleted: new FormControl(false),
    });

    if (this.fromPatient)
      this.editForm.patchValue({ patientId: this.patientId });

    this.subscription.add(this.editForm.get('invoiceId').valueChanges.subscribe(x => {
      if (x)
        this.min = this.invoices.find(y => y.invoiceId == x)?.invoiceDate;
    }));
  }

  newPatient(myPatientId) {
    this.loadPatient(myPatientId);
  }

  loadPatient(myPatientId) {
    this.patientId = myPatientId;
    this.editForm.patchValue({ patientId: this.patientId });
    this.getInvoices();
  }

  payorSelectedHandler(e) {
    this.editForm.patchValue({ payorId: e.payorId, payorName: e.displayName });
  }
}
