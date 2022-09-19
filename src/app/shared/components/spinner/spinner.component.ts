import { Component,  ChangeDetectorRef, OnInit, Renderer2 } from '@angular/core';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { SpinnerService } from '../../services/spinner.service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent extends SubscriptionBase implements OnInit {
    isLoading = false;

  constructor(private spinner : SpinnerService,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef) {super()
  }

  ngOnInit(): void {
    this.subscription.add(
      this.spinner.stateChanged.subscribe(val => {
        //this.isLoading = val;
        if(val){
         this.renderer.addClass(document.body, 'show-spinner');
       }else{
        this.renderer.removeClass(document.body, 'show-spinner');
       }
     })
    )

}

}
