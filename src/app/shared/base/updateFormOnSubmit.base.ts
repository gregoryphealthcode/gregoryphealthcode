import { FormGroup } from '@angular/forms';
export abstract class UpdateFormOnSubmitBase {
  public submitting: boolean;
  public editForm: FormGroup;
  protected onSubmit() {
    this.submitting = true;
    this.markFormAsTouched(this.editForm);
  }
  protected markFormAsTouched(form: FormGroup) {
    // tslint:disable-next-line: forin
    for (const i in form.controls) {
      this.markControlAsTouched(form.controls[i]);
    }
  }
  protected markControlAsTouched(control: any) {
    control.markAsTouched();
    control.updateValueAndValidity();
    if (control.controls) {
      this.markFormAsTouched(control);
    }
  }
  protected markFormAsDirty(form: FormGroup) {
    // tslint:disable-next-line: forin
    for (const i in form.controls) {
      this.markControlAsDirty(form.controls[i]);
    }
  }
  protected markControlAsDirty(control: any) {
    control.markAsDirty();
    if (control.controls) {
      this.markFormAsDirty(control);
    }
  }
}


