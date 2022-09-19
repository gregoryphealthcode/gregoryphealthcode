import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./app-card.component.html",
  styleUrls: ["./app-card.component.scss"],
})
export class AppCardComponent implements OnInit {
  @Input() title: string;
  @Input() hasFullWidth = false;

  constructor() {}

  ngOnInit() {}
}
