import { Component, OnInit } from '@angular/core';
import { UserStore } from 'src/app/shared/stores/user.store';
import { reportsItems } from '../items';

@Component({
  selector: 'app-reports-centre',
  templateUrl: './reports-centre.component.html',
  styleUrls: ['./reports-centre.component.scss']
})
export class ReportsCentreComponent implements OnInit {
  public items = reportsItems;

  constructor(
  ) { }

  ngOnInit() {
  }
}
