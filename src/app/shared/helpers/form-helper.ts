import { FormControl, Validators } from "@angular/forms";

export const requiredIfValidator = (predicate) => {
  return (formControl => {
    if (!formControl.parent) {
      return null;
    }

    if (predicate()) {
      return Validators.required(formControl);
    }
    return null;
  });
};

export const requiresAndPatternIfValidator = (predicate, parameter: string) => {
  return (formControl => {
    if (!formControl.parent) {
      return null;
    }

    if (predicate()) {
      if (parameter == "Email")
        return [Validators.required(formControl), Validators.email, Validators.maxLength(50)];

      if (parameter == "Mobile")
        return [Validators.required(formControl), Validators.pattern(/^(\+[\d]{1,5}|0)?[1-9]\d{9}$/)];

      if (parameter == "Name")
        return [Validators.required(formControl), Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ0-9 \'-]*$')];

      if (parameter == "Postcode")
        return [Validators.required(formControl), Validators.pattern('^[a-zA-Z0-9 ]*$')];
    }
  });
};