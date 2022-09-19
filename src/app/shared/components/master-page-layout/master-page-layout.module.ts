import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MasterPageLayoutComponent } from "./master-page-layout.component";
import { FooterModule } from "./footer/footer.component";
import { PinRequiredModule } from "../pin-required-modal/pin-required.module";
import { RouterModule } from "@angular/router";
import { MasterPageHeaderComponent } from "./master-page-header/master-page-header.component";
import { HeaderRightSectionComponent } from "./master-page-header/header-right-section/header-right-section.component";
import { HeaderComponent } from "./master-page-header/header/header.component";
import { DevExtremeModule, DxPopupModule, DxTemplateHost } from "devextreme-angular";
import { SideNavigationMenuModule, UserPanelModule } from "..";
import { SideNavOuterToolbarComponent } from "src/app/layouts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    MasterPageLayoutComponent,
    MasterPageHeaderComponent,
    HeaderRightSectionComponent,
    SideNavOuterToolbarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    RouterModule,
    PinRequiredModule,
    SideNavigationMenuModule,
    DevExtremeModule,
    DxPopupModule,
    MatIconModule,
    MatButtonModule,
    UserPanelModule
  ],
  providers: [DxTemplateHost],
  exports: [MasterPageLayoutComponent, HeaderRightSectionComponent],
})
export class MasterPageLayoutModule {}
