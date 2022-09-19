import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuComponent } from '../..';
import { ScreenService } from '../../../services';
import { DxContextMenuComponent, DxDrawerComponent } from 'devextreme-angular';
import { DxPopupComponent } from 'devextreme-angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss']
})
export class SideNavOuterToolbarComponent implements OnInit {

  @ViewChild('contextmenupatient') contextmenupatient: DxContextMenuComponent;
  @ViewChild(DxDrawerComponent) drawer: DxDrawerComponent;
  @ViewChild('newLetterPopup') newLetterPopup: DxPopupComponent;
  @ViewChild('patientpopup') patientPopup: DxPopupComponent;
  @ViewChild('sidenavigationmenu') sidenavigationmenu: SideNavigationMenuComponent;

  @Input() menuItems: any[];
  @Input() title: string;

  selectedRoute = '';
  menuOpened: boolean;
  temporaryMenuOpened = false;
  menuMode = 'overlap';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  xsMinMenuSize = 48;
  lgMinMenuSize = 260;
  shaderEnabled = false;
  showPatientContextMenu: boolean;
  showTodaysPatientContextMenu: boolean;
  rightClickedPatientItem: any;
  rightClickedTodaysPatientItem: any;
  rightClickedYesterdaysPatientItem: any;
  contextmenuPatientId: any;
  contextmenuAppointmentId: any;
  contextmenuTitle = '';
  alreadyselectedPatientId: any;
  alreadyselectedAppointmentId: any;
  blankContextMenuItems = [{}];

  patientContextMenuItems = [
    { text: 'Patient Details', icon: 'dx-icon fas fa-user-injured', beginGroup: true },
    { text: 'New Letter', icon: 'dx-icon fas fa-file-word', beginGroup: true },
    { text: 'New Invoice', icon: 'dx-icon fas fa-pound-sign', beginGroup: true },
  ];

  todaysPatientContextMenuItems = [
    { text: 'Mark As Attended', icon: 'dx-icon fas fa-calendar-check' },
    { text: 'Did Not Attend', icon: 'dx-icon fas fa-calendar-times' },
    { text: 'Book Next Appointment', icon: 'dx-icon fas fa-calendar-alt' },
    { text: '-', icon: '' },
    { text: 'Patient Details', icon: 'dx-icon fas fa-user-injured' },
    { text: 'New Letter', icon: 'dx-icon fas fa-file-word' },
    { text: 'New Invoice', icon: 'dx-icon fas fa-pound-sign' },
    { text: 'Take Payment', icon: 'dx-icon fas fa-pound-sign' },
  ];

  constructor(private screen: ScreenService, private router: Router, private route: ActivatedRoute) {
    this.showPatientContextMenu = false;
    this.showTodaysPatientContextMenu = false;
    this.rightClickedPatientItem = null;
    this.rightClickedTodaysPatientItem = null;
    this.contextmenuPatientId = null;
    this.contextmenuAppointmentId = null;

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {

        this.selectedRoute = val.urlAfterRedirects.split('?')[0];
      }
    });

    // this.menuItems = navigation;
    // this.menuItems.forEach(x => {
    //   if(x.path){x.key = x.path}
    // });
  }

  ngOnInit() {
    this.menuOpened = this.screen.sizes['screen-large'];

    this.screen.changed.subscribe(() => this.updateDrawer());

    this.updateDrawer();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];
    const isMedium = this.screen.sizes['screen-medium'];

    this.menuMode = isLarge ? 'shrink' : 'overlap';
    // this.menuRevealMode = isXSmall ? 'slide' : 'expand';

    this.minMenuSize = isXSmall ? 0 : this.xsMinMenuSize;

    this.shaderEnabled = !isLarge;

    if (isMedium)
      this.menuOpened = false;

    if (isLarge)
      this.menuOpened = true;
  }

  menuToggleHandler() {
    this.menuOpened = !this.menuOpened;
    const isXSmall = this.screen.sizes['screen-x-small'];

    if (isXSmall) {
      this.minMenuSize = this.menuOpened ? this.lgMinMenuSize : 0;
    }

    this.drawer.instance.repaint();
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return false;
    //return !this.menuOpened;
  }

  navigationChanged() {
    // expand menu if not shown
    if (!this.menuOpened) { return; }

    if (this.hideMenuAfterNavigation) {
      this.temporaryMenuOpened = false;
      this.menuOpened = false;
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }


  /* newletterpopupshown() {
    console.log('new letter popup shown. apptid:', this.alreadyselectedAppointmentId);
    this.newCorrespondenceComponent.patientId = this.alreadyselectedPatientId;
    this.newCorrespondenceComponent.appointmentId = this.alreadyselectedAppointmentId;
    this.newCorrespondenceComponent.loadPatient(this.alreadyselectedPatientId);
  } */

  patientpopupshown() {
    console.log('patient popup shown, loading patient:', this.alreadyselectedPatientId);
  }
}

