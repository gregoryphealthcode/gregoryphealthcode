import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DxTextBoxComponent } from "devextreme-angular";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { SubscriptionBase } from "../../base/subscribtion.base";

@Component({
  selector: "app-grid-search-text-box",
  templateUrl: "./grid-search-text-box.component.html",
  styleUrls: ["./grid-search-text-box.component.scss"],
})
export class GridSearchTextBoxComponent extends SubscriptionBase implements OnInit {
  @Output() changed = new EventEmitter();
  @Input() enableCustomWidth: boolean;
  @Input() placeholder = "Search";
  @Input() mask;
  @Input() maskRules;
  @Input() get term() { return this._term };
  set term(value) {
    if (value) {
      this._term = value;
      this.search();
    }
  }

  public findIconButton = {
    icon: "find",
    stylingMode: "text",
  };

  public clearIconButton = {
    icon: "clear",
    stylingMode: "text",
    onClick: () => {
      this.term = "";
      this.changed.emit("");
      this.searchTerms.next("");
      this.search();
    },
  };

  private _term;
  private searchTerms = new BehaviorSubject<string>(undefined);
  @ViewChild('searchBox') searchBox: DxTextBoxComponent;

  constructor() {
    super();
  }

  ngOnInit() {
    this.subscription.add(
      this.searchTerms
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((x) => {
            if (x !== undefined) this.changed.emit(x);
          })
        )
        .subscribe()
    );
  }

  search() {
    if (this.searchBox.instance && !this.searchBox.value) {
      this.searchTerms.next("");
    } else {
      this.searchTerms.next(this.term);
    }
  }

  clearSearch() {
  }
}
