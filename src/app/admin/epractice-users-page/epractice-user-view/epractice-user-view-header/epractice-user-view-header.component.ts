import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetAdminUserDetailsModel } from '../../user-admin.service';

@Component({
  selector: 'app-epractice-user-view-header',
  templateUrl: './epractice-user-view-header.component.html',
  styleUrls: ['./epractice-user-view-header.component.scss']
})
export class EpracticeUserViewHeaderComponent implements OnInit {
  @Input() user: GetAdminUserDetailsModel;
  @Output() editClicked = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

}
