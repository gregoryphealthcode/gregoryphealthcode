import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SitesService } from "src/app/shared/services/sites.service";
import { SitesStore } from 'src/app/shared/stores/sites.store';
import { DialogTemplateComponent } from '../../dialog/dialog-template.component';
import { MatDialog } from '@angular/material/dialog';
import { showErrorSnackbar, showSuccessSnackbar } from 'src/app/shared/helpers/other';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactTypeViewModel } from 'src/app/shared/models/ContactTypeViewModel';
import { ChangeDetectorRef, Component, Input, OnInit, } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AppInfoService, TitlesViewModel } from "src/app/shared/services";
import { ContactDetailsModel, ContactService, lluContactTypeModel, } from "src/app/shared/services/contact.service";

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit-contact.component.html',
    host: { class: 'd-flex flex-column flex-grow-1' },
    styleUrls: ['./edit-contact.component.scss'],
})
@AutoUnsubscribe
export class EditContactComponent extends ReactiveFormBase implements OnInit {
    constructor(
        public siteService: SitesService,
        private siteStore: SitesStore,
        public appInfo: AppInfoService,
        public changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private contactService: ContactService,
        private snackBar: MatSnackBar,
        private router: Router,
        public spinnerService: SpinnerService
    ) {
        super();
    }

    @Input() contactId: string;
    @Input() contactClassification: number
    @Input() filterOn: string;

    private _contactClassification: number;

    titles: TitlesViewModel[];
    isInactive: boolean;
    isPayor: boolean;
    contactDetails: ContactDetailsModel;
    isGP = false;
    gluContactTypes: lluContactTypeModel[] = [];
    organisations: ContactTypeViewModel[] = [];
    departments: ContactTypeViewModel[] = [];
    contactType: ContactTypeViewModel;
    organisationType: ContactTypeViewModel;
    searchSelected: number;
    editForm: FormGroup;
    sendViaPatientzone = true;
    isSitePatientzone: boolean;

    protected httpRequest = (x: any) => this.contactService.updateContact(x);

    ngOnInit(): void {
        this.getSitePatientzone();
        this.getTitles();
        this.setupForm();
        if (this.contactId !== undefined) {
            this.contactService.getContactDetails(this.contactId).subscribe(x => {
                this.contactDetails = x;
                this.contactClassification = x.contactType.contactClassificationId;
                this.gluContactTypes.filter(y => y.contactClassificationId == this.contactClassification);
                this.sendViaPatientzone = this.contactDetails.sendViaPatientzone;
                if (x.contactType.contactType == "GP")
                    this.isGP = true;

                this.getLocalContactTypes();
            })
        }

        this.editForm.get('isPayor').valueChanges.subscribe(x => {
            this.isPayor = x;
        });

        this.editForm.get('sendViaPatientzone').valueChanges.subscribe(x => {
            this.sendViaPatientzone = x;
        });
    }

    getSitePatientzone() {
        this.siteService.getSitePatientzone().subscribe(data => {
            this.isSitePatientzone = data;
        })
    }

    private setupForm() {
        if (this.contactClassification == 1) {
            this.editForm = new FormGroup({
                contactType: new FormControl(undefined, Validators.required),
                firstName: new FormControl(undefined, [Validators.required, Validators.maxLength(100)]),
                lastName: new FormControl(undefined, [Validators.required, Validators.maxLength(50)]),
                title: new FormControl(undefined),
                knownAs: new FormControl(undefined, Validators.maxLength(25)),
                isPayor: new FormControl(undefined),
                sendViaPatientzone: new FormControl(undefined),
                inactive: new FormControl(undefined),
                inactiveReason: new FormControl(undefined, Validators.maxLength(50)),
                primaryAddress: new FormControl(undefined, null),
                jobTitle: new FormControl(undefined, Validators.maxLength(50)),
                qualifications: new FormControl(undefined, null),
                contactId: new FormControl(undefined, null),
            });
        }
        else {
            this.editForm = new FormGroup({
                contactType: new FormControl(undefined, Validators.required),
                displayName: new FormControl(undefined, [Validators.required, Validators.maxLength(50)]),
                isPayor: new FormControl(undefined),
                sendViaPatientzone: new FormControl(undefined),
                inactive: new FormControl(undefined),
                inactiveReason: new FormControl(undefined, Validators.maxLength(50)),
                primaryAddress: new FormControl(undefined, null),
                jobTitle: new FormControl(undefined, Validators.maxLength(50)),
                qualifications: new FormControl(undefined, null),
                contactId: new FormControl(undefined, null),
            });
        }
    }

    populateForm(x) {
        var type = this.gluContactTypes.find(val => val.contactType == x.contactType.contactType);
        super.populateForm(x);
        this.editForm.patchValue({ contactType: type });
    }

    inactiveChanged(e) {
        this.isInactive = e.value;
    }

    isPayorChanged(e) {
        this.isPayor = e.value;
    }

    delete() {
        this.openDialog();
    }

    getTitles() {
        this.subscription.add(
            this.siteService.getTitlesForSite().subscribe((value) => {
                this.titles = value;
                this.titles.sort(function (a, b) {
                    if (a.title < b.title) return -1;
                    if (a.title > b.title) { return 1; }
                    return 0;
                });
                this.changeDetectorRef.detectChanges();
            })
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogTemplateComponent, {
            width: '250px',
            data: { title: 'Are you sure?', message: 'Are you sure you want to delete this Contact?' },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.spinnerService.start();
                this.subscription.add(this.contactService.deleteContact(this.contactId).subscribe(data => {
                    if (data) {
                        showSuccessSnackbar(this.snackBar, 'Contact successfully deleted');
                        this.spinnerService.stop();
                        this.router.navigate(['/contact-list']);
                    }
                    else {
                        this.snackBar.open('Unable to delete contact', 'Close', {
                            panelClass: 'badge-danger',
                            duration: 3000,
                        });
                    }
                },
                    () => {
                        showErrorSnackbar(this.snackBar);
                        this.spinnerService.stop();
                    }));
            }
        });
    }

    getFormGroupControlValue(formGroup: FormGroup, controlName: string) {
        return formGroup.controls[controlName].value;
    }

    getLocalContactTypes() {
        this.contactService.getLocalContactTypes(
            this.contactClassification
        ).subscribe((value) => {
            this.gluContactTypes = value;
            this.gluContactTypes.sort(function (a, b) {
                if (a.contactType < b.contactType) return -1;
                if (a.contactType > b.contactType) { return 1; }
                return 0;
            });
            this.gluContactTypes.filter(x => x.contactClassificationId == this._contactClassification);
            this.populateForm(this.contactDetails);
        });
    }

    setFilterOn(e) {
        const organisation = this.gluContactTypes.find((x) => x.contactTypeId === e.contactTypeId).contactTypeId;
        if (organisation !== undefined && organisation !== null) {
            const uniqueNo = this.gluContactTypes.find((x) => x.contactTypeId === organisation).contactClassificationId;
            this.searchSelected = uniqueNo;
            this.changeDetectorRef.detectChanges();
        } else {
            this.searchSelected = e.uniqueNo;
        }
    }
}
