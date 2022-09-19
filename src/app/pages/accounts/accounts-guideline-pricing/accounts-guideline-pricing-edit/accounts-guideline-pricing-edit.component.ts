import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { EditManagedServicePayorModel, EstvPriceDetailsModel, ManagedServiceLocationModel, ManagedServicePayorLocationModel, ManagedServicePayorModel, PricingMatrixService } from 'src/app/shared/services/pricing-matrix.service';

@Component({
  selector: 'app-accounts-guideline-pricing-edit',
  templateUrl: './accounts-guideline-pricing-edit.component.html',
  styleUrls: ['./accounts-guideline-pricing-edit.component.scss']
})
export class AccountsGuidelinePricingEditComponent extends ReactiveFormBase implements OnInit {
  @Input() payorId: string;
  @Input() payor: string;
  @Input() serviceId: number;
  @Input() service: string;

  @Output() saved = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  locations: ManagedServiceLocationModel[] = [];
  payorDetails: EditManagedServicePayorModel;
  estvDetails: EstvPriceDetailsModel;
  minPrice = 0;
  maxPrice = 1000000;
  medianPrice;
  highPrice;
  narrativeMessage = "";
  optionMessage = "";
  warningMessage = "";
  rejectMessage = "";
  showWarning = false;

  constructor(
    private pricingMatrixService: PricingMatrixService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  onSuccessfullySaved = (x) => {
    this.saved.emit(x)
  };

  protected httpRequest = (x) => {
    let model = new EditManagedServicePayorModel();

    let servicePrice = {
      managedServicePayorId: x.managedServicePayorId,
      managedPayorId: x.managedPayorId,
      managedServiceId: x.managedServiceId,
      price: x.price != "" ? x.price : null,
    };

    model.servicePrice = servicePrice;
    model.locationPrices = [];

    x.locations.forEach(location => {
      let locationPrice = {
        managedServicePayorLocationId: this.payorDetails.locationPrices.find(y => y.locationId == location.id)?.managedServicePayorLocationId,
        managedPayorId: x.managedPayorId,
        managedServiceId: x.managedServiceId,
        locationId: location.id,
        price: location.value != "" ? location.value : null,
      }
      model.locationPrices.push(locationPrice);
    });

    return this.pricingMatrixService.updatePayorServicePrices(model);
  };

  ngOnInit() {
    this.getLocations();
    this.getPrices();
    this.getEstv();

    this.setupForm();

    this.subscription.add(
      this.editForm.get('price')
        .valueChanges
        .pipe(tap
          (x => {
            if (!x) { return }

            if (x > this.highPrice && x <= this.maxPrice)
              this.showWarning = true;
            else
              this.showWarning = false;
          }
          )
        ).subscribe()
    )
  }

  private setupForm() {
    this.editForm = new FormGroup({
      managedServicePayorId: new FormControl(null),
      managedPayorId: new FormControl(this.payorId),
      managedServiceId: new FormControl(this.serviceId),
      price: new FormControl(null, [Validators.max(this.maxPrice)]),
      locations: new FormArray([]),
    });
  }

  getLocations() {
    this.pricingMatrixService.getLocations().pipe(tap(data => {
      this.locations = data;
      const arr = this.getLocationsFormArray();
      this.locations.forEach(location => {
        let control = this.formBuilder.group(
          {
            id: location.locationId,
            description: location.locationName,
            value: ["", null],
          }
        );
        arr.push(control);
      });
    })).subscribe();
  }

  getPrices() {
    this.pricingMatrixService.getManagedPayorServicePrices(this.payorId, this.serviceId).subscribe(data => {
      this.payorDetails = data;
      this.editForm.patchValue({ managedServicePayorId: this.payorDetails?.servicePrice?.managedServicePayorId })
      this.editForm.patchValue({ price: this.payorDetails?.servicePrice?.price });
      var locations = this.getLocationsFormArray();
      locations.controls.forEach(control => {
        var price = this.payorDetails.locationPrices.find(x => x.locationId == control.value.id)?.price;
        control.patchValue({ value: price });
      })
    })
  }

  getEstv() {
    this.pricingMatrixService.getEstvPayorServicePriceDetails(this.payorId, this.serviceId).subscribe(data => {
      if (data.success) {
        this.estvDetails = data.data;
        if (this.estvDetails?.minPrice)
          this.minPrice = this.estvDetails.minPrice;
        if (this.estvDetails?.maxPrice) {
          this.maxPrice = this.estvDetails.maxPrice;
          this.editForm.controls.price.setValidators(Validators.max(this.maxPrice));
        }
        if (this.estvDetails?.medianPrice)
          this.medianPrice = this.estvDetails.medianPrice;
        if (this.estvDetails?.highPrice)
          this.highPrice = this.estvDetails.highPrice;
        if (this.estvDetails?.narrativeMessage)
          this.narrativeMessage = '* ' + this.estvDetails.narrativeMessage;
        if (this.estvDetails?.optionMessage)
          this.optionMessage = this.estvDetails.optionMessage;
        if (this.estvDetails?.warningMessage)
          this.warningMessage = '* ' + this.estvDetails.warningMessage;
        if (this.estvDetails?.rejectMessage)
          this.rejectMessage = this.estvDetails.rejectMessage;
      }
    })
  }

  getLocationsFormArray() {
    return this.editForm.controls.locations as FormArray;
  }

  setControlValue(control: string, value: string) {
    this.editForm.patchValue({
      [control]: value
    });
  }
}
