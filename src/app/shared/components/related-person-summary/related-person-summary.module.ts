import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UserAvatarModule } from "../user-avatar/user-avatar.module";
import { RelatedPersonSummaryComponent } from "./related-person-summary.component";

@NgModule({
  declarations: [RelatedPersonSummaryComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    UserAvatarModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule

  ],
  exports:[
    RelatedPersonSummaryComponent
  ]
})
export class RelatedPersonSummaryModule { }
