import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;

  constructor() { }

  ngOnInit() {

  }

  public get initials(){
    let toReturn = '';

    if(this.firstName){
      toReturn += this.firstName.charAt(0);
    }

    if(this.lastName){
      toReturn += this.lastName.charAt(0);
    }

    return toReturn;
  }
}
