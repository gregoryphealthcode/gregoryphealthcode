import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { DxDataGridModule, DxFileUploaderModule, DxPopupModule, DxRadioGroupModule } from "devextreme-angular";
import { AppFormModule } from "../shared/components/app-form/app-form.module";
import { AppPageWrapperModule } from "../shared/components/app-page-wrapper/app-page-wrapper.module";
import { MasterPageLayoutModule } from "../shared/components/master-page-layout/master-page-layout.module";
import { PopUpFormModule } from "../shared/components/pop-up-form/pop-up-form.module";
import { PostcodeToAddressModule } from "../shared/components/postcode-to-address/postcode-to-address.module";
import { AppButtonModule } from "../shared/widgets/app-button/app-button.module";
import { AppCardModule } from "../shared/widgets/app-card/app-card.module";
import { GridSearchTextBoxModule } from "../shared/widgets/grid-search-text-box/grid-search-text-box.module";
import { AdminMasterPageComponent } from "./admin-master-page/admin-master-page.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminUsersPageComponent } from "./admin-users-page/admin-users-page.component";
import { EpracticeUserViewHeaderComponent } from "./epractice-users-page/epractice-user-view/epractice-user-view-header/epractice-user-view-header.component";
import { EpracticeUserViewComponent } from "./epractice-users-page/epractice-user-view/epractice-user-view.component";
import { EpracticeUsersPageComponent } from "./epractice-users-page/epractice-users-page.component";
import { GroupViewHeaderComponent } from "./groups-page/group-view/group-view-header/group-view-header.component";
import { GroupViewComponent } from "./groups-page/group-view/group-view.component";
import { GroupsPageComponent } from "./groups-page/groups-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { AdminUserAddEditComponent } from "./shared/admin-user-add-edit/admin-user-add-edit.component";
import { EpracticeUserAddEditComponent } from "./shared/epractice-user-add-edit/epractice-user-add-edit.component";
import { GroupAdminAddEditComponent } from "./shared/group-admin-add-edit/group-admin-add-edit.component";
import { GroupGridComponent } from "./shared/group-grid/group-grid.component";
import { GroupLinkPopupComponent } from "./shared/group-link-popup/group-link-popup.component";
import { SiteAdminAddEditComponent } from "./shared/site-admin-add-edit/site-admin-add-edit.component";
import { SiteLinkPopupComponent } from "./shared/site-link-popup/site-link-popup.component";
import { SitesGridComponent } from "./shared/sites-grid/sites-grid.component";
import { UserLinkPopupComponent } from "./shared/user-link-popup/user-link-popup.component";
import { UsersGridComponent } from "./shared/users-grid/users-grid.component";
import { SiteViewHeaderComponent } from "./sites-page/site-view/site-view-header/site-view-header.component";
import { SiteViewComponent } from "./sites-page/site-view/site-view.component";
import { SitesPageComponent } from "./sites-page/sites-page.component";
import { GlobalTemplatesComponent } from './global-templates/global-templates.component';
import { GlobalTemplateAddEditComponent } from './shared/global-template-add-edit/global-template-add-edit.component';
import { SiteMigrationLogComponent } from './sites-page/site-view/site-migration-log/site-migration-log.component';



@NgModule({
  declarations: [
    AdminMasterPageComponent,
    HomePageComponent,
    SitesPageComponent,
    SiteAdminAddEditComponent,
    SiteViewComponent,
    SiteViewHeaderComponent,
    UsersGridComponent,
    EpracticeUserAddEditComponent,
    EpracticeUsersPageComponent,
    EpracticeUserViewComponent,
    EpracticeUserViewHeaderComponent,
    SitesGridComponent,
    AdminUsersPageComponent,
    AdminUserAddEditComponent,
    GroupsPageComponent,
    GroupViewComponent,
    GroupViewHeaderComponent,
    GroupAdminAddEditComponent,
    UserLinkPopupComponent,
    GroupGridComponent,
    SiteLinkPopupComponent,
    GroupLinkPopupComponent,
    GlobalTemplatesComponent,
    GlobalTemplateAddEditComponent,
    SiteMigrationLogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    MasterPageLayoutModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    GridSearchTextBoxModule,
    AppButtonModule,
    DxDataGridModule,
    PopUpFormModule,
    DxPopupModule,
    DxRadioGroupModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormModule,
    AppCardModule,
    PostcodeToAddressModule,
    AppPageWrapperModule,
    DxFileUploaderModule,
  ],
  exports:[
    AdminRoutingModule
  ]
})
export class AdminModule { }
