import { Component, Input, OnInit } from '@angular/core';
import { UserStore } from 'src/app/shared/stores/user.store';

@Component({
  selector: 'app-reports-back-button',
  templateUrl: './reports-back-button.component.html',
  styleUrls: ['./reports-back-button.component.scss']
})

export class ReportsBackButtonComponent implements OnInit {
  @Input() path = '../centre';
  @Input() pathName = 'Reports Centre';

  constructor(
  ) { }

  ngOnInit() {
  }
}