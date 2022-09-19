import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit {
  constructor() { }

  @Input() direction = 'column';

  @HostBinding('class') class = 'a-form-group ';  

  ngOnInit() {
    if (this.direction === 'row'){
      this.class += 'd-row';
    }
    else{
      this.class += 'd-col';
    }
  }
}