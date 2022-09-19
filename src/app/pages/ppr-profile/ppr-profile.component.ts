import { Component, OnInit, AfterViewInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-ppr-profile",
  templateUrl: "./ppr-profile.component.html",
  styleUrls: ["./ppr-profile.component.scss"]
})
export class PprProfileComponent implements OnInit, AfterViewInit {
  public pprurl = environment.pprurl;

  ngOnInit() { }

  ngAfterViewInit() {
    window.open(this.pprurl, "_blank");
    console.log("opening");
  }
}