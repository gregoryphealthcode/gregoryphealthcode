import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogFormResponse } from '../../models/DialogFormResponse';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-grid-state-save',
  templateUrl: './grid-state-save.component.html',
  styleUrls: ['./grid-state-save.component.scss']
})
export class GridStateSaveComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<GridStateSaveComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private userStore: UserStore) 
    { }

  name:string;
  isGlobal: boolean;
  updateMode: boolean;
  isAdmin: boolean = this.userStore.isAdmin();
  isNew = true;
  canBeUpdated: boolean;  

  ngOnInit() {
    if(!this.data.state || (this.data.state && this.data.state.id === '0')){
      this.isNew = true;
      this.canBeUpdated = this.isAdmin || !this.isGlobal;
      this.updateMode = false;
    }
    else{
      this.isNew = false;
      this.isGlobal = this.data.state.isGlobal;
    }
  }

  public onDialogSave() {
    const create = this.isNew || this.updateMode === false;

    if(create && (!this.name || this.name.trim().length === 0)){return;}

    let request:GridStateSaveModalResponse = {create};

    if(create){
      request = {
        create,
        createModel: {
          description: this.name,
          isGlobal: this.isGlobal
        }
      }
    }

    const response = new DialogFormResponse(true, request);
    this.dialogRef.close(response);
  }

  public onCancel(){
    this.dialogRef.close(new DialogFormResponse(false, {}));
  }

}

export interface GridStateSaveModalResponse{
  create:boolean,
  createModel? : GridStateSaveModalCreateModel
}

export interface GridStateSaveModalCreateModel{
  description: string;
  isGlobal: boolean
}