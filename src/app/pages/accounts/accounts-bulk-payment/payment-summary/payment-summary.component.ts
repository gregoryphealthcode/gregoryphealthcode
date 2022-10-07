import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-payment-summary",
  templateUrl: "./payment-summary.component.html",
  styleUrls: ["./payment-summary.component.scss"],
})
export class PaymentSummaryComponent implements OnInit {
  constructor() {}

  @Input()  get unallocated(): number { return this._unallocated; }
  set unallocated(unallocated: number) {
    if (unallocated){
      this._unallocated = unallocated;
      this.setDataSource()
    }
  }
  private _unallocated = 0;

  @Input()  get shortFalls(): number { return this._shortFalls; }
  set shortFalls(shortFalls: number) {
    if (shortFalls){
      this._shortFalls = shortFalls;
      this.setDataSource()
    }
  }
  private _shortFalls = 0;

  @Input() get allocated(): number { return this._allocated; }
  set allocated(allocated: number) {
    if (allocated){
      this._allocated = allocated;
      this.setDataSource()
    }
  }
  private _allocated = 0;

  @Input() currencyCode: string;

  public dataSource = [];  

  ngOnInit() {

  }

  private setDataSource(){
    this.dataSource = [
      { name: "allocated", val: this.allocated, color: 'rgb(29, 178, 245)' },
      { name: "unallocated", val: this.unallocated, color: 'rgb(245, 86, 74)' },
      { name: "shortfall", val: this.shortFalls, color: 'orange' },
    ];
  }

  customizePoint(pointInfo: any) {
    return { color: pointInfo.data.color };
  }
}