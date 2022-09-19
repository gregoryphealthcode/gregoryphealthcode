import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {
  public msgurl = environment.msgurl;
  ngOnInit() { }

  ngAfterViewInit() {
    window.open(this.msgurl, "_blank");
    console.log("opening");
  }
}