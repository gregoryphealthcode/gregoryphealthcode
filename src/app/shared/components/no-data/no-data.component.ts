import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent{
  @Input() public title: string;
  @Input() public showTitle = true;
  @Input() public text: string;
  @Input() public showImage = true;
  @Input() public showNoDataIcon = false;

}
