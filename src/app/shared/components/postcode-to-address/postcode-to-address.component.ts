import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Optional, Self, ChangeDetectorRef } from '@angular/core';
import { PostcodeToAddressService, PostcodeToAddressResponseModel } from './postcode-to-address.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { FormControlBase } from '../app-form/app-form-control.base';
import { NgControl } from '@angular/forms';
import { dxPopupOptions } from 'devextreme/ui/popup';

@Component({
  selector: 'app-postcode-to-address',
  templateUrl: './postcode-to-address.component.html',
  styleUrls: ['./postcode-to-address.component.scss']
})
export class PostcodeToAddressComponent extends FormControlBase implements OnInit, OnDestroy {
  constructor(
    private dataService: PostcodeToAddressService,
    @Optional() @Self() control: NgControl,
    private cdt: ChangeDetectorRef
  ) {
    super(control);
  }

  @Output() addressSelect = new EventEmitter<PostcodeToAddressResponseModel>();
  public dropdownOptions = {
    width: 250
  }

  public error: string;
  public addresses: PostcodeToAddressResponseModel[];
  public dataSource: any;

  private searchTerms = new Subject<string>();
  private subscription = new Subscription();
  previousValue: string;

  process() {
    this.error = undefined;
  }

  private setDataSource() {
    this.dataSource = new DataSource({
      store: new CustomStore({
        loadMode: "raw",
        load: () => {
          return this.getAdresses$()
            .toPromise().then(x => {
              if (!x) { return [] } else { return x }
            });
        }
      }),
      paginate: false
    });
  }

  private getAdresses$() {
    return this.dataService.getAddressesForPostcode(this.value)
      .pipe(
        map(x => {
          this.error = undefined;
          this.isInvalid = undefined;
          if (x.success) {
            x.addresses.forEach(a => a.postcode = this.value);
          } else {
            this.error = x.errorMessage;
          }
          this.cdt.detectChanges();
          return x.addresses
        })
      )
  }

  ngOnInit() {
    this.caption = "Postcode";

    this.subscription.add(
      this.searchTerms.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => { this.dataSource.reload() })

      ).subscribe()
    )

    this.setDataSource();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  valueChanged(e) {
    if (!e.value)
      return;

    if (!e.previousValue && !e.event)
      return;

    if (this.previousValue != undefined &&
      this.previousValue != '' &&
      this.previousValue != null &&
      this.previousValue.toUpperCase() == this.value)
      return;

    this.previousValue = this.value;
    this.value = this.value.toUpperCase();
    if (e.value.length > 5) {
      this.searchTerms.next(e.value);
    }
  }

  public onSelectionChanged(event) {
    if (event.itemData && event.itemData.postcode) {
      this.emitSelectedAddress(event.itemData);
    }
  }

  private emitSelectedAddress(address: PostcodeToAddressResponseModel) {
    this.addressSelect.emit(address);
  }
}
