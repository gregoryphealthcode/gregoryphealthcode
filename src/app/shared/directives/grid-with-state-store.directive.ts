import { Directive, EventEmitter, Host, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'src/app/_helpers/autoUnsubscribe';
import { OpenDialogFormBase } from '../base/OpenDialogFormBase';
import { DialogTemplateComponent } from '../components/dialog/dialog-template.component';
import { GridStateSaveComponent, GridStateSaveModalResponse } from '../components/grid-state-save/grid-state-save.component';
import { DialogFormResponse } from '../models/DialogFormResponse';
import { AppMessagesService } from '../services/app-messages.service';
import { GetGridStateResponseModel, GridStateService } from '../services/grid-state.service';
import { UserStore } from '../stores/user.store';

@Directive({
  selector: '[appGridWithStateStore]'
})

@AutoUnsubscribe
export class GridWithStateStoreDirective implements OnInit, OnDestroy {
  @Input() gridId: string;
  @Output() openSiteSelectorModel = new EventEmitter<string>();

  @Output() stateSelected = new EventEmitter<string>();

  public showPopup: boolean;
  private subscription = new Subscription();
  stateIndex = 0;
  isMedSec = false;

  private selectedState: GetGridStateResponseModel;
  private states: GetGridStateResponseModel[] = [];

  private addEditModal = new OpenDialogFormBase(
    this.matDialog,
    GridStateSaveComponent,
    x => this.onModalClose(x)
  );

  private dxSelectBox: any;

  constructor(
    @Host() public grid: DxDataGridComponent,
    private service: GridStateService,
    private matDialog: MatDialog,
    private userStore: UserStore,
    private appMessages: AppMessagesService
  ) {
    grid.stateStoring = {
      enabled: true,
      type: 'custom'
    }
  }


  ngOnInit() {
    this.isMedSec = this.userStore.isMedSecUser();

    this.subscription.add(
      this.grid.onToolbarPreparing.subscribe(
        e =>
          this.addSelectBoxAndSaveBtn(e)
      )
    )
  }

  private addSelectBoxAndSaveBtn(e) {
    const dataGrid = e.component;
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        name: 'expander',
        options: {
          icon: 'spinnext',
          type: 'default',
          hint: "Expand all",
          onClick(e) {
            const expanding = e.component.option('icon') === 'spinnext';
            dataGrid.option('grouping.autoExpandAll', expanding);
            e.component.option('icon', expanding ? 'spindown' : 'spinnext');
            e.component.option('hint', expanding ? 'Collapse all' : 'Expand all');
          },
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        cssClass: 'gridstate-label-btn',
        locateInMenu: 'auto',
        options: {
          stylingMode: 'text',
          text: 'Template'
        }
      },
      {
        location: 'after',
        widget: 'dxSelectBox',
        locateInMenu: 'auto',
        options: {
          width: 180,
          dataSource: this.buildDataSource(),
          onInitialized: e => {
            this.dxSelectBox = e.component;
          },
          displayExpr: 'name',
          valueExpr: 'id',
          value: this.stateIndex,
          wrapItemText: true,
          onValueChanged: e => {
            this.gridStateSelectionChanged(e)
          }
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'trash',
          type: 'default',
          hint: 'Delete',
          onClick: () => this.deleteGridState()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'save',
          type: 'default',
          hint: 'Save settings',
          onClick: () => this.saveStateClicked()
        }
      }
    )
  }

  private buildDataSource() {
    return new DataSource({
      store: new CustomStore({
        loadMode: "raw",
        load: () => {
          return this.service.getGridStates(this.gridId)
            .pipe(map(x => {
              this.states = x;
              x.unshift({
                id: '0',
                name: 'Default',
                contents: '',
                isGlobal: false
              })
              return x;
            }))
            .toPromise();
        }
      }),
      paginate: false
    });
  }

  gridStateSelectionChanged(e) {
    this.stateIndex = e.value;
    if (e.value == "0") {
      this.selectedState = this.states.find(x => x.name == "default")
      this.grid.instance.state({});
    }
    else {
      this.selectedState = this.states.find(x => x.id === e.value);
      if (this.selectedState && this.selectedState.contents) {
        const state = JSON.parse(this.selectedState.contents);
        this.grid.instance.state(state);
      }
    }

    if (this.selectedState)
      this.stateSelected.emit(this.selectedState.name);
    else
      this.stateSelected.emit("default");
  }

  public save() {
    this.selectedState = this.dxSelectBox.option('selectedItem');
    this.addEditModal.openModal({ state: this.selectedState });
  }

  private saveStateClicked() {
    this.selectedState = this.dxSelectBox.option('selectedItem');
    if (this.userStore.isMedSecUser() && !this.selectedState) {
      this.openSiteSelectorModel.emit();
    } else {
      this.save();
    }
  }

  private deleteGridState() {

    const dialogRef = this.matDialog.open(DialogTemplateComponent, {
      width: '250px',
      data: { title: 'Are you sure?', message: 'Are you sure you want to delete this template?' },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.selectedState = this.dxSelectBox.option('selectedItem');
        if (this.selectedState && this.selectedState.id) {
          this.service.deleteGridState(this.selectedState.id).subscribe(x => {
            if (x.success) {
              this.appMessages.showSuccessSnackBar("Template deleted successfully");
            }
            if (x.errors) {
              this.appMessages.showFailedSnackBar("An error occurred.");
            }
            const dataSource = this.dxSelectBox.getDataSource();
            dataSource.reload();
            this.dxSelectBox.option('value', 0);
          });
        } else {
          this.appMessages.showWarningSnackBar("Please select a template");
        }
      }
    });
  }

  private addState(name: string, isGlobal: boolean) {
    const state = JSON.stringify(this.grid.instance.state());

    this.subscription.add(
      this.service.addGridState(this.gridId, name, state, isGlobal).subscribe(x => {
        if (x.errors) {
          this.appMessages.showFailedSnackBar(x.errors[0]);
        } else {
          const dataSource = this.dxSelectBox.getDataSource();
          dataSource.reload();
          this.dxSelectBox.option('value', x.data.id);
          this.appMessages.showSuccessSnackBar("Template saved successfully");
        }
      })
    )
  }

  private updateState() {
    const state = JSON.stringify(this.grid.instance.state());
    this.subscription.add(
      this.service.updateGridState(this.selectedState.id, state).subscribe()
    )
    this.appMessages.showSuccessSnackBar("Template updated successfully");
  }

  private onModalClose(record: DialogFormResponse) {
    if (record.saved) {
      const model: GridStateSaveModalResponse = record.data;

      if (model.create) {
        this.addState(model.createModel.description, model.createModel.isGlobal)
      }
      else {
        this.updateState();
      }


    }
  }

  ngOnDestroy() { }

}
