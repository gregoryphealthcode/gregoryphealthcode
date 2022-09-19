import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { BureauSites, SitesService } from 'src/app/shared/services/sites.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { PatientService, ShareModel } from '../../services/patient.service';

@Component({
  selector: 'app-med-sec-duplicate-site-selector',
  templateUrl: './med-sec-duplicate-site-selector.component.html',
  styleUrls: ['./med-sec-duplicate-site-selector.component.scss']
})
export class MedSecDuplicateSiteSelectorComponent extends ReactiveFormBase implements OnInit {
  @Input() duplicateId: string;
  @Input() duplicateType: string;

  medsecSites: BureauSites[];

  constructor(
    private templateService: TemplateService,
    private patientService: PatientService,
    private siteService: SitesService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  protected httpRequest = x => {
    let model = new ShareModel();
    model.id = x.id;
    model.siteIds = [];

    x.sites.forEach(site => {
      if (site.value)
        model.siteIds.push(site.id);
    })

    switch (this.duplicateType) {
      case ("Patients"):
        return this.patientService.shareMedsecPatientWithSite(model);

      case ("Templates"):
        return this.templateService.shareMedsecTemplateWithSite(model);
    }
  };

  ngOnInit() {
    this.getMedsecSites();
    this.setupForm();
  }

  getMedsecSites() {
    return this.siteService.getBureauSites().pipe(
      tap(data => {
        this.medsecSites = data;
        const arr = this.getSitesFormArray();
        this.medsecSites.forEach((element) => {
          let control = this.formBuilder.group({
            id: element.siteId,
            description: element.siteName,
            value: [""],
          });
          arr.push(control);
        })
      })).subscribe()
  }

  setupForm() {
    this.editForm = new FormGroup({
      id: new FormControl(this.duplicateId),
      sites: new FormArray([])
    });
  }

  getSitesFormArray() {
    return this.editForm.controls.sites as FormArray;
  }
}
