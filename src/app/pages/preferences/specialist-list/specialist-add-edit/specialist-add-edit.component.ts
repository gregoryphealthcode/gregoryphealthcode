import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PopupReactiveFormBase } from 'src/app/shared/base/popupReactiveForm.base';
import { FileModel } from 'src/app/shared/helpers/file';
import { Speciality } from 'src/app/shared/models/Speciality';
import { SubSpeciality } from 'src/app/shared/models/SubSpeciality';
import { TitlesViewModel } from 'src/app/shared/services';
import { SitesService } from 'src/app/shared/services/sites.service';
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { AppointmentTypesService } from '../../diary/appointment-types.service';

@Component({
  selector: 'app-specialist-add-edit',
  templateUrl: './specialist-add-edit.component.html',
  styleUrls: ['./specialist-add-edit.component.scss']
})
export class SpecialistAddEditComponent extends PopupReactiveFormBase implements OnInit {
  lluTitles: any[];
  specialities: Speciality[];
  subSpecialities: SubSpeciality[];
  showPhotoPopup: boolean;
  image: FileModel;
  types: any[];
  siteId: string;
  titles: TitlesViewModel[] = [];
  filteredOptions: Observable<TitlesViewModel[]>;

  constructor(
    private siteStore: SitesStore,
    private siteService: SitesService,
    private appointmentTypesService: AppointmentTypesService
  ) {
    super();
  }

  protected controllerName = "appointmentOwner";
  protected onOpened = (data) => {
    this.siteId = this.siteStore.getSelectedSite().siteId;
    this.getDropdownsData();
    this.getTitles();
    this.setupForm();
    this.setup(data);
    if (this.isNew)
      this.active = true;
  };

  ngOnInit() {
    this.siteId = this.siteStore.getSelectedSite().siteId;

    if (this.isNew)
      this.active = true;
  }

  private getDropdownsData() {
      this.siteService.getTitlesForSite(this.siteStore.getSelectedSite().siteId).subscribe((data) => {
        this.lluTitles = data;
      });

    // !!!!!!!!! NEED TO GET SPECIALITY & SUBSPECIALITY DATA FROM HEALTHCODE SERVICE !!!!!!!!!!!!!!!!!
    // !!!!!!!!! NEED TO GET SPECIALITY & SUBSPECIALITY DATA FROM HEALTHCODE SERVICE !!!!!!!!!!!!!!!!!
    this.specialities = [
      { id: 1, name: 'Orthopaedics' },
      { id: 2, name: 'Oncology' },
      { id: 3, name: 'Cardiology' },
      { id: 4, name: 'Radiology' }
    ];

    this.subSpecialities = [
      { id: 'Knee', name: 'Knee', parentId: 1 },
      { id: 'Heart', name: 'Heart', parentId: 3 },
      { id: 'Foot', name: 'Foot', parentId: 1 },
      { id: 'Hip', name: 'Hip', parentId: 1 },
      { id: 'Shoulder', name: 'Shoulder', parentId: 1 },
      { id: 'Children', name: 'Children', parentId: 2 },
      { id: 'Adults', name: 'Adults', parentId: 2 }
    ];

    this.addToSubscription(
      this.appointmentTypesService.getAppointmentTypes()
        .pipe(tap((x) => (this.types = x)))
    );
  }

  private setupForm() {
    this.editForm = new FormGroup({
      ownerId: new FormControl(undefined),
      displayName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(50)]),
      title: new FormControl(null, Validators.required),
      jobTitle: new FormControl(undefined, Validators.maxLength(50)),
      speciality: new FormControl(null),
      subSpeciality: new FormControl(undefined),
      types: new FormControl(null, Validators.required),     
      gmcNo: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$'), Validators.maxLength(20)]),
      active: new FormControl(undefined), 
      notes: new FormControl(undefined, Validators.maxLength(250)),
    });
  }

  imageChanged(image: FileModel) {
    this.image = image;
    this.showPhotoPopup = false;
  }

  protected getTitles() {
    return this.siteService.getTitlesForSite(this.siteId).subscribe(data => {
      this.titles = data;
      this.titles.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      })
    });
  }
}