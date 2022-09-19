import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.scss']
})
export class PageBodyComponent implements OnInit {
  constructor() { }

  @Input() hasTopBorder = true;  

  ngOnInit() {
  }
}