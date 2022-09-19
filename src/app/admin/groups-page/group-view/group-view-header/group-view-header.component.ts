import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetAdminGroupDetailsModel } from '../../group-admin.service';

@Component({
  selector: 'app-group-view-header',
  templateUrl: './group-view-header.component.html',
  styleUrls: ['./group-view-header.component.scss']
})
export class GroupViewHeaderComponent implements OnInit {
  @Input() group: GetAdminGroupDetailsModel;
  @Output() editClicked = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }
}
