import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import DataSource from "devextreme/data/data_source";
import { PopupReactiveFormBase } from "src/app/shared/base/popupReactiveForm.base";
import { EpisodeTypes, UserService, } from "src/app/shared/services/user.service";

@Component({
  selector: "app-appointment-type-add-edit",
  templateUrl: "./appointment-type-add-edit.component.html",
  styleUrls: ["./appointment-type-add-edit.component.scss"],
})
export class AppointmentTypeAddEditComponent extends PopupReactiveFormBase implements OnInit {
  servicesDataSource: DataSource;
  episodeTypes: EpisodeTypes[] = [];
 
  constructor(
    private userSite: UserService
  ) {
    super();
  }

  protected controllerName = "appointmentTypes";
  protected onOpened = (data) => {
    this.getDropDownData();
    this.setup(data);
  };

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(undefined),
      serviceTypeCode: new FormControl(undefined, Validators.required),
      description: new FormControl(undefined, [Validators.required, Validators.maxLength(50)]),
      duration: new FormControl(undefined, Validators.required),
      defaultEpisodeType: new FormControl(undefined),
      sessionTypeId: new FormControl(undefined),
      backgroundColour: new FormControl(undefined, Validators.required),
    });
  }

  private getDropDownData() {
    this.userSite.getServiceTypes().subscribe(x => {
      this.servicesDataSource = new DataSource({
        store: {
          data: x,
          type: 'array',
        },
        paginate: true,
        pageSize: 50,
      })
    });

    this.subscription.add(this.userSite.getEpisodeTypes().subscribe(data => {
      this.episodeTypes = data;
    }));
  }
}