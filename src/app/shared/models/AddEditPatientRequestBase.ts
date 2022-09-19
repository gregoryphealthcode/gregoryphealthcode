
export interface AddEditPatientRequestBase {
  lastName: string;
  firstName: string;
  birthDate?: Date;
  gender: string;
  title: string;
  initials: string;
  noChase: boolean;
  sendViaPatientzone : boolean;
  identifiesAs: string;
}


export class AddPatientRequest implements AddEditPatientRequestBase {
  lastName: string;
  firstName: string;
  birthDate?: Date;
  gender: string;
  title: string;
  noChase: boolean;
  sendViaPatientzone: boolean;
  validatedDuplicateCheck: boolean;
  initials: string;
  identifiesAs: string;

  constructor(addPatientForm: any,  validateDuplicateCheck: boolean) {
    this.lastName = addPatientForm.lastName;
    this.firstName = addPatientForm.firstName;
    this.gender = addPatientForm.gender;
    this.title = addPatientForm.title;
    this.birthDate = addPatientForm.dateOfBirth;
    this.initials = addPatientForm.initials;
    this.identifiesAs = addPatientForm.identifiesAs;
    this.noChase =  addPatientForm.noChase === true ? true : false;
    this.sendViaPatientzone =  addPatientForm.sendViaPatientzone === true ? false : true;

    this.validatedDuplicateCheck = validateDuplicateCheck;
  }
}

export class EditPatientRequest implements AddEditPatientRequestBase {
  lastName: string;
  firstName: string;
  birthDate?: Date;
  gender: string;
  title: string;
  noChase: boolean;
  onStop: boolean;
  sendViaPatientzone: boolean;
  patientId: string;
  deceased?: boolean;
  deceasedDate?: string;
  inactive: boolean;
  inactiveReason: string;
  initials: string;
  identifiesAs: string;

  constructor(addPatientForm: any, patientId: string) {
    this.lastName = addPatientForm.lastName;
    this.firstName = addPatientForm.firstName;
    this.gender = addPatientForm.gender;
    this.title = addPatientForm.title;
    this.birthDate = addPatientForm.birthDate;
    this.noChase =  addPatientForm.noChase;
    this.onStop = addPatientForm.onStop;
    this.sendViaPatientzone = addPatientForm.sendViaPatientzone;
    this.deceased = addPatientForm.deceased;
    this.deceasedDate = addPatientForm.deceasedDate;
    this.inactive = addPatientForm.inactive;
    this.inactiveReason = addPatientForm.inactiveReason;
    this.initials = addPatientForm.initials;
    this.identifiesAs = addPatientForm.identifiesAs;
    this.patientId = patientId;
  }
}
