import { AfterViewInit, Directive, OnDestroy, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { Subscription } from "rxjs";
import CustomStore from "devextreme/data/custom_store";
import { HttpClient, HttpParams } from "@angular/common/http";
import DataSource from "devextreme/data/data_source";
import { AppInjector } from "../services/app.injector";
import { SignalRBase } from "./signalR.base";
import { SignalRMainHubService } from "../services/signal-rmain-hub.service";

@Directive()
export abstract class GridBase implements AfterViewInit, OnDestroy {
  constructor() {
    const injector = AppInjector.getInjector();
    this.httpClient = injector.get(HttpClient);
    this.signalRHub = injector.get(SignalRMainHubService);
  }

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  private lookUpData: LookupDataStore[] = [];
  private lookupDataIndex = 0;
  private signalRHub: SignalRMainHubService;
  private signalRCallbacks = new Map(); 

  protected httpClient: HttpClient;
  protected subscription = new Subscription();
  protected controllerUrl: string;

  public dataSourceStore: CustomStore;
  public dataSource: DataSource;
  public searchBoxValue = '';

  public settings = {
    pageSize: 15,
    allowedPageSizes: [5, 10, 20],
    showBorders: false,
    showRowLines: false,
    showColumnLines: false,
    rowAlternationEnabled: true,
    hoverStateEnabled: true,
  };  

  protected setupDataSource(options?: GridLoadOptions) {
    const key = this.getValue("id", "key", options);
    const urls = {
      loadUrl: this.controllerUrl + this.getValue("getAll", "loadUrl", options),
      insertUrl:
        this.controllerUrl +
        this.getValue("insertfromgrid", "insertUrl", options),
      updateUrl:
        this.controllerUrl +
        this.getValue("updatefromgrid", "updateUrl", options),
      deleteUrl:
        this.controllerUrl + this.getValue("delete", "deleteUrl", options),
    };

    const loadParams =
      options && options.loadParams ? options.loadParams : undefined;
    const loadCallback =
      options && options.loadCallback ? options.loadCallback : undefined;
    const loadParamsCallback =
      options && options.loadParamsCallback
        ? options.loadParamsCallback
        : undefined;

    this.dataSource = this.createCustomDataSource(
      key,
      urls,
      loadParams,
      loadCallback,
      loadParamsCallback
    );
  }

  public doSearch(){
    this.dataGrid.instance.searchByText(this.searchBoxValue);
  }

  private getValue(
    defaultValue: string,
    propName: string,
    options?: GridLoadOptions
  ) {
    let keyName = defaultValue;
    if (options && options[propName]) {
      keyName = options[propName];
    }
    return keyName;
  }

  public onRowUpdating(event) {
    event.newData = Object.assign({}, event.oldData, event.newData);
  }

  protected createDropDownDataStore(
    getAction: string,
    keyName: string,
    baseUrl?: string
  ) {
    this.lookupDataIndex++;
    const index = this.lookupDataIndex;
    let url = this.controllerUrl + getAction;
    if (baseUrl) {
      url = baseUrl + getAction;
    }

    function isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== "";
    }

    const store = {
      key: keyName,
      byKey: (key) => {
        const values = this.lookUpData.find((x) => x.index === index)
          .data as Array<any>;
        const toReturn = values.find((x) => x[keyName] === key);
        return toReturn; //
      },
      load: (loadOptions) => {
        let params: HttpParams = new HttpParams();
        [
          "sort",
          "skip",
          "take",
          "requireTotalCount",
          "requireGroupCount",
          "sort",
          "filter",
          "totalSummary",
          "group",
          "groupSummary",
        ].forEach((i) => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });

        if (
          !("filter" in loadOptions) &&
          isNotEmpty(loadOptions.searchValue) &&
          isNotEmpty(loadOptions.searchExpr)
        ) {
          // console.log(loadOptions.searchExpr);
          // console.log(loadOptions.searchOperation);
          // console.log(loadOptions.searchValue);
          const filter: any = [];
          filter.push([
            loadOptions.searchExpr,
            loadOptions.searchOperation,
            loadOptions.searchValue,
          ]);
          params = params.set("filter", JSON.stringify(filter));
        }

        return this.httpClient
          .get(url, { params })
          .toPromise()
          .then((result: any) => {
            let data = result;
            if (result.data) {
              data = result.data;
            }
            this.lookUpData.push({ index, data });
            return {
              data: result.data,
              totalCount: result.totalCount,
              summary: result.summary,
              groupCount: result.groupCount,
            };
          });
      },
    };

    return store;
  }

  private createCustomDataSource(
    keyName: string,
    urls: GridUrls,
    loadParams?: GridLoadParams[],
    loadCallback?: (x) => void,
    loadParamsCallback?: () => GridLoadParams[]
  ): DataSource {
    function isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== "";
    }

    const options = {
      key: keyName,
      load: (loadOptions) => {
        let params: HttpParams = new HttpParams();
        [
          "skip",
          "take",
          "requireTotalCount",
          "requireGroupCount",
          "sort",
          "filter",
          "totalSummary",
          "group",
          "groupSummary",
        ].forEach((i) => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });

        if (loadParams) {
          loadParams.forEach((x) => {
            params = params.set(x.name, x.value);
          });
        }

        if (loadParamsCallback) {
          const paramsCallback = loadParamsCallback();
          if (paramsCallback) {
            paramsCallback.forEach((x) => {
              params = params.set(x.name, x.value);
            });
          }
        }

        return this.httpClient
          .get(urls.loadUrl, { params })
          .toPromise()
          .then((result: any) => {
            if (loadCallback) {
              loadCallback(result);
            }

            if (this.dataGrid) {
              this.dataGrid.instance.endCustomLoading();
            }

            return {
              data: result.data,
              totalCount: result.totalCount,
              summary: result.summary,
              groupCount: result.groupCount,
            };
          });
      },
      insert: (values) => {
        return this.httpClient.post(urls.insertUrl, values).toPromise();
      },
      remove: (key) => {
        return this.httpClient
          .delete(urls.deleteUrl + "/" + encodeURIComponent(key))
          .toPromise()
          .then(() => {});
      },
      update: (key, values) => {
        return this.httpClient
          .put(urls.updateUrl + "/" + encodeURIComponent(key), values)
          .toPromise();
      },
    };

    return new DataSource(options);
  }

  public refreshData() {
    this.dataGrid.instance.refresh();
  }

  addSignalRListener(methodName: string, callback: any) {
    this.signalRCallbacks.set(methodName, callback);
    this.signalRHub.addListener(methodName, callback);
  }

  ngAfterViewInit() {
    if (this.dataGrid) {
      this.dataGrid.instance.beginCustomLoading("Loading");
    }
  }

  ngOnDestroy() {
    if(this.dataSource){
      this.dataSource.dispose();
    }
    this.subscription.unsubscribe();
    this.signalRCallbacks.forEach((value, key) =>
      this.signalRHub.removeListener(key, value)
    );
  }
}

interface GridUrls {
  loadUrl: string;
  insertUrl: string;
  updateUrl: string;
  deleteUrl: string;
}

interface GridLoadOptions {
  key?: string;
  loadUrl?: string;
  insertUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;
  loadParams?: GridLoadParams[];
  loadCallback?: (x) => void;
  loadParamsCallback?: () => GridLoadParams[];
}

interface GridLoadParams {
  name: string;
  value: any;
}

interface LookupDataStore {
  index: number;
  data: any;
}
