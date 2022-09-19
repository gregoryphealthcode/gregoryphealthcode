import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() path: string;

  constructor() { }

  ngOnInit() {
  }
}
