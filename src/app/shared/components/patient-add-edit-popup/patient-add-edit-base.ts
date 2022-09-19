import { startWith, map, tap, switchMap } from 'rxjs/operators';
import { TitlesViewModel, AppInfoService, PatientDetailsModel } from 'src/app/shared/services';
import { SitesService } from 'src/app/shared/services/sites.service';
import { EMPTY, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { PatientService } from 'src/app/shared/services/patient.service';
import { toIsoString } from '../../helpers/date-format';

export abstract class AddEditPatientBase extends ReactiveFormBase {
  public titles: TitlesViewModel[] = [];
  public filteredOptions: Observable<TitlesViewModel[]>;
  public myControl = new FormControl();
  public genders: string[] = this.appinfo.getGenders();
  public identifies: string[] = this.appinfo.getIdentifiesAs();
  public age: string = '';
  protected abstract httpRequest: (x: any) => any;

  public get firstName() {
    return this.editForm.controls['firstName'].value;
  }
  public get lastName() {
    return this.editForm.controls['lastName'].value;
  }
  public get birthDate() { 
    return this.editForm.controls['birthDate'].value; 
  };

  public possibleDuplicates: PatientDetailsModel[];

  constructor(
    private siteservice: SitesService,
    public appinfo: AppInfoService,
    public patientService: PatientService,
  ) {
    super();
  }

  protected getTitles$() {
    return this.siteservice.getTitlesForSite().pipe(tap(data => {
      this.titles = data;
      this.titles.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) { return 1; }
        return 0;
      });
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => _filter(value))
      );
    })
    );

    function _filter(value: string): TitlesViewModel[] {
      const filterValue = value.toLowerCase();
      return this.titles.filter((option) =>
        option.title.toLowerCase().includes(filterValue)
      );
    }
  }

  public hasError = (controlName: string) => {
    return this.editForm.get(controlName).hasError('required');
  }

  public calculate_age(dob: Moment) {
    const now = moment();
    const age = moment.duration(now.diff(dob));
    return age.years().toString();
  }

  public allCaps(e) {
    let textcontent =
      e.component._$textEditorInputContainer[0].firstChild.value;
    textcontent = textcontent.toUpperCase();
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  protected subscribeToDateOfBirthChanges() {
    this.subscription.add(
      this.editForm
        .get('birthDate')
        .valueChanges
        .pipe(switchMap(x => {
          if (!x) { return EMPTY }

          const isDate = x instanceof Date;
          if (!isDate) {
            let d = new Date(x);
            this.editForm.controls['birthDate'].setValue(d);
            return EMPTY;
          }

          const isFuture = x.getTime() > new Date().getTime();
          if (isFuture) {
              let d = new Date(x)
              d.setFullYear(d.getFullYear() - 100);
              this.editForm.controls['birthDate'].setValue(d);
              return EMPTY;
          }           

          const userTimezoneOffset = x.getTimezoneOffset() * 60000;
          x = new Date(x.getTime() - userTimezoneOffset).toUTCString();
          this.age = this.calculate_age(x);

          if (this.lastName != "" && this.firstName != "" && this.birthDate != "") {
            return this.patientService.checkDuplicatePatient(this.lastName, this.firstName, toIsoString(this.birthDate))
              .pipe(tap(y => { this.possibleDuplicates = y; }))
          }
          return EMPTY
        })
        ).subscribe()
    );
  }

  protected subscribeToDateOfDeathChanges() {
    this.subscription.add(
      this.editForm
        .get('deceasedDate')
        .valueChanges
        .pipe(switchMap(x => {
          if (!x) { return EMPTY }

          const isDate = x instanceof Date;
          if (!isDate) {
            let d = new Date(x);
            this.editForm.controls['deceasedDate'].setValue(d);
            return EMPTY;
          }

          const isFuture = x.getTime() > new Date().getTime();
          if (isFuture) {
              this.editForm.controls['deceasedDate'].setValue(new Date());
              return EMPTY;
          }  
        })
        ).subscribe()
    );
  }

  protected subscribeToDuplicateChanges() {
    this.subscription.add(
      this.editForm.get("firstName").valueChanges.subscribe((x) => {     
        if (this.lastName != "" && this.firstName != "" && this.birthDate) {
          this.subscription.add(this.patientService.checkDuplicatePatient(this.lastName, this.firstName, toIsoString(this.birthDate)).subscribe(x => {
            this.possibleDuplicates = x;
          }));
        }
      })
    );
    this.subscription.add(
      this.editForm.get("lastName").valueChanges.subscribe((x) => {      
        if (this.lastName != "" && this.firstName != "" && this.birthDate) {
          this.subscription.add(this.patientService.checkDuplicatePatient(this.lastName, this.firstName, toIsoString(this.birthDate)).subscribe(x => {
            this.possibleDuplicates = x;
          }));
        }
      })
    );
  }

  public firstLetterCaps(e) {
    let textcontent =
      e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) {
      textcontent = textcontent.toUpperCase();
    }
    if (textcontent.length > 2) {
      // tslint:disable-next-line: quotemark
      if (
        textcontent[textcontent.length - 2] === ' ' ||
        textcontent[textcontent.length - 2] === '\''
      ) {
        let s = '' + textcontent[textcontent.length - 1];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }
}