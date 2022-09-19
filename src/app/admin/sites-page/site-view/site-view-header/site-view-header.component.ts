import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetAdminSiteDetailsModel } from '../../site-admin.service';

@Component({
  selector: 'app-site-view-header',
  templateUrl: './site-view-header.component.html',
  styleUrls: ['./site-view-header.component.scss']
})
export class SiteViewHeaderComponent implements OnInit {

  @Input() site: GetAdminSiteDetailsModel;
  @Output() editClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }



}
