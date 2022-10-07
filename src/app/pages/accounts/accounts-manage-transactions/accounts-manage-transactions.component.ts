import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounts-manage-transactions',
  templateUrl: './accounts-manage-transactions.component.html'
})


export class AccountsManageTransactionsComponent implements OnInit {
  constructor( private router: ActivatedRoute) {
    this.invoiceId = this.router.snapshot.paramMap.get('invoiceId');
  }

  invoiceId : string;

  ngOnInit() {
  }
}
