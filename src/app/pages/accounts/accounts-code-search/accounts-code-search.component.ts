import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accounts-code-search',
  templateUrl: './accounts-code-search.component.html',
  styleUrls: ['./accounts-code-search.component.scss']
})
export class AccountsCodeSearchComponent implements OnInit {
  public codeSearchUrl = environment.codeSearchUrl;

  ngOnInit() { }

  ngAfterViewInit() {
    window.open(this.codeSearchUrl, "_blank");
    console.log("opening");
  }
}