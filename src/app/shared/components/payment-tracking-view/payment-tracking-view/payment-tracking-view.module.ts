import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DxDataGridModule, DxSwitchModule } from "devextreme-angular";
import { AppButtonModule } from "src/app/shared/widgets/app-button/app-button.module";
import { UserAvatarModule } from "../../user-avatar/user-avatar.module";
import { PaymentTrackingViewComponent } from "./payment-tracking-view.component";

@NgModule({
  declarations: [PaymentTrackingViewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    UserAvatarModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    DxSwitchModule,
    FontAwesomeModule,
    AppButtonModule,
    DxDataGridModule
  ],
  exports:[PaymentTrackingViewComponent]
})
export class PaymentTrackingViewModule { }
