import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gdpr-guide',
  templateUrl: './gdpr-guide.component.html',
  styleUrls: ['./gdpr-guide.component.scss']
})
export class GdprGuideComponent implements OnInit {
  public PageNumber = 1;

  constructor(
    public changedetectorref: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  public NavigateToPage(newpagenumber) {
    console.log('navigate to page: ', newpagenumber);
    this.PageNumber = newpagenumber;
    this.changedetectorref.detectChanges();
  }
}