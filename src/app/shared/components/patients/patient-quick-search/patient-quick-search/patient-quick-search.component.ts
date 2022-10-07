import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { dxPopupOptions } from "devextreme/ui/popup";
import { SubscriptionBase } from "src/app/shared/base/subscribtion.base";
import { PatientService } from "src/app/shared/services/patient.service";


@Component({
  selector: "app-patient-quick-search",
  templateUrl: "./patient-quick-search.component.html",
  styleUrls: ["./patient-quick-search.component.scss"],
})
export class PatientQuickSearchComponent extends SubscriptionBase implements OnInit {
  @Input() get patientId(): string
  {
    return this._patientId;
  }
  set patientId (value) {
    this._patientId = value;
    const model = { patientId: this.patientId}
    this.advancedSearchPatientSelected(model);
  }
  private _patientId: string;

  @Input()
  public set value (value){
    this._value = value;
    if(value){
      this.onValueChanged.emit(value);
      this.newPatient.emit(value);
    }
  }
  public get value(){ return this._value;}
  private _value: any;

  @Input() disabled;

  @Output() onValueChanged = new EventEmitter<string>();
  @Output() newPatient = new EventEmitter<string>();

  public showAddPatient: boolean;
  public dataSource: DataSource;
  public dropdownOptions = {
    titleTemplate: "titleTemplate",
    closeOnOutsideClick: true,
    height: "300px",
    showTitle: true,
  };

  constructor(private dataService: PatientService) {super()} //

  ngOnInit() {
    this.getQuickSearchRecords();
    //this.selectBoxData.reload();
  }

  getQuickSearchRecords() {
    this.subscription.add(
      this.dataService.getQuickSearchViewRecords().subscribe((x) => {
        this.dataSource = new DataSource({
          store: {
            data: x,
            type: "array",
          },
          sort: ["lastName"],
          paginate: true,
          pageSize: 30,
        })
      })
    )

  }

  advancedSearchPatientSelected(e) {
    this.value = e.patientId;
  }

  newPatientAdded(patientId){
    this.showAddPatient = false;
    this.value = patientId;
    //this.getQuickSearchRecords();
  }
}
