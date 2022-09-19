import { Component, OnInit } from '@angular/core';
import { adminNavigation } from 'src/app/app-navigation';

@Component({
  selector: 'app-admin-master-page',
  templateUrl: './admin-master-page.component.html',
  styleUrls: ['./admin-master-page.component.scss']
})
export class AdminMasterPageComponent implements OnInit {
  public menuItems:any = adminNavigation;

  constructor() { }

  ngOnInit() {
  }

}
