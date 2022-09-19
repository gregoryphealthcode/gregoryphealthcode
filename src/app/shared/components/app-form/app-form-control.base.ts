import { Directive, DoCheck, HostBinding, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { thickness } from 'devexpress-reporting/scopes/reporting-chart-internal';
import { capitalizeEachWord } from '../../helpers/other';

@Directive()
export abstract class FormControlBase implements ControlValueAccessor, OnInit, DoCheck {
  constructor(
    public controlDir: NgControl
  ) {
    controlDir.valueAccessor = this;
  }

  @Input() set caption(value: string) {
    if (value) {
      this._caption = value;
    }
  };
  get caption() {
    if (this.required == true && !this.readonly) {
      return this._caption + ' *';
    }
    return this._caption;
  }
  
  @Input() placeholder: string;
  @Input() controlType = 'd';
  @Input() inputType = 'text';
  @Input() hint: string;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() toUppercase: boolean;
  @Input() capitalizeEachWord: boolean;
  @Input() externalError: boolean;
  @Input() direction = 'column';
  @Input() errorMessage;

  @HostBinding('class') class = 'a-form-group ';

  private _caption = '';
  private classList = ['a-form-group '];

  isInvalid: boolean;
  error: string;
  required = false;

  protected onValueChange: (x) => void;

  set value(value: any) {
    if (value && this.toUppercase) {
      value = value.toUpperCase()
    }

    if (value && this.capitalizeEachWord) {
      value = capitalizeEachWord(value);
    }

    this._value = value;

    this.onChange(value);
    this.onTouched();
    if (this.onValueChange) {
      this.onValueChange(value);
    }
  }
  get value() {
    return this._value;
  }
  private _value: any;


  ngOnInit() {
    if (this.direction === 'row') {
      this.classList.push('d-row ');
    }
    else {
      this.classList.push('d-col ');
    }

    this.class += this.classList.join(' ');
  }

  ngDoCheck() {
    const control = this.controlDir.control;
    if (control instanceof FormControl) {
      this.error = undefined;
      this.isInvalid = control.touched && !control.valid;

      if (this.isInvalid) { this.setError(); }
      this.setWrapperClass();

      if (!this.isInvalid && this.required) 
      {
        this.required = false;        
      }

      if (!control.valid && control.errors && control.errors.required) { this.required = true }    
    }
  }

  private setError() {
    const ctrl = this.controlDir.control;
    if (ctrl.errors) {
      if (ctrl.errors.required) {
        this.error = `* ${this.parseCaption(this.caption)} required.`;
      }
      if (ctrl.errors.email) {
        this.error = '* Not a valid email.';
      }
      if (ctrl.errors.maxLength) {
        this.error = `* Max length is exceeded.`;
      }
      if (ctrl.errors.minLength) {
        this.error = '* Min length not met.';
      }
      if (ctrl.errors.max && this.errorMessage) {
        this.error = '* ' + this.errorMessage;
      }
      // Todo min and maxlength
    }
  }

  private parseCaption(caption: string) {
    caption = caption.trim();
    if (caption.charAt(caption.length - 1) === '*') {
      caption = caption.slice(0, -1);
    }
    return caption;
  }

  private setWrapperClass() {
    this.classList = this.classList.filter(x => x !== 'extra-info');
    this.class += this.classList.join(' ');
  }

  get hasErrors() {
    return (
      this.controlDir.control &&
      this.controlDir.control.touched &&
      this.controlDir.control.errors
    );
  }

  onTouched = () => { };
  onChange = (_) => { };

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: FormControl) {
    this.isInvalid = control.valid;
  }
}