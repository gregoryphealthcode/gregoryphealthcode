import { Directive, AfterContentInit, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appSnackBar]',
})
export class SnackBarDirective implements OnInit, AfterContentInit {

  @Input() message : string;
  @Input() isError : boolean;

  constructor(
    private snackBar: MatSnackBar
  ) {}

  ngAfterContentInit(): void {

  }

  ngOnInit(): void {
    if(this.isError)
    {
      this.snackBar.open(this.message, 'Close', {
        panelClass: 'badge-danger',
        duration: 3000,
      });
    }
    else
    {
    this.snackBar.open(this.message, 'Close', {
        panelClass: 'badge-success',
        duration: 3000,
      });
  }
  }


}
