import { Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar, } from "@angular/material/snack-bar";
import { ReactiveFormBase } from "src/app/shared/base/reactiveForm.base";
import { ContactModel, ContactService } from "src/app/shared/services/contact.service";
import { AutoUnsubscribe } from "src/app/_helpers/autoUnsubscribe";

@Component({
  selector: "app-contact-add-to-patient",
  templateUrl: "./contact-add-to-patient.component.html",
  styleUrls: ["./contact-add-to-patient.component.scss"],
})
@AutoUnsubscribe
export class ContactAddToPatientComponent extends ReactiveFormBase implements OnInit {
  constructor(
    private contactService: ContactService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  @Input() contactId: string;
  @Input() patientId: string;
  @Input() fromPatient: boolean;
  @Input() isEdit: boolean;

  @Output() saved = new EventEmitter();
  @Output() formClosed = new EventEmitter();
  
  contactDetails: ContactModel;

  protected httpRequest = x => {
    if (this.patientId) { 
      if (this.isEdit)
        return this.contactService.updatePatientContactReference(x);
      else
        return this.contactService.addContactToPatient(x);
    }
    else {
      this.saved.emit(x);
    }
  }

  onSuccessfullySaved = (x) => { 
    if (x.success) {
      this.saved.emit();
      this.snackBar.open('Contact added successfully', 'Close', {
        panelClass: 'badge-success',
        duration: 3000,
      });
    }
  }

  ngOnInit() {
    this.setupForm();    
  }

  private setupForm() {
    this.editForm = new FormGroup({
      patientId: new FormControl(undefined),
      contactId: new FormControl(undefined),
      theirRef: new FormControl(undefined, Validators.maxLength(50)),
      referrer: new FormControl(false),
      isPrimary: new FormControl(false),
    });

    if (this.isEdit) {
      this.getContactReferenceDetails();
    }
    else {
      this.editForm.patchValue({patientId: this.patientId});
      this.editForm.patchValue({contactId: this.contactId});
    }
  }

  getContactReferenceDetails() {
    this.contactService.getContactReferenceDetails(this.patientId, this.contactId).subscribe(data => {      
      this.contactDetails = data;
      this.contactDetails.contactId = this.contactId;
      this.contactDetails.patientId = this.patientId;
      this.populateForm(this.contactDetails); 
    });
  }

  close() {
    this.formClosed.emit();
  }
}