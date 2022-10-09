import { Component, NgModule, Output, Input, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, } from '@angular/core';
import { DxTreeViewModule, DxTreeViewComponent, DxTemplateModule, DxTooltipModule, } from 'devextreme-angular';
import * as events from 'devextreme/events';
import { AppInfoService } from '../../services';
import ODataStore from 'devextreme/data/odata/store';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../stores/user.store';
import { Router, NavigationEnd, } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { capitalizeFirstLetter } from '../../helpers/other';
import { AuthService } from '../../services/auth.service';
import { AppointmentPopupAddEditModule } from '../appointment-popup-add-edit/appointment-popup-add-edit.module';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent extends SubscriptionBase implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DxTreeViewComponent) menu: DxTreeViewComponent;

  @Input() selectedItem: string;
  @Input() collapseMenu: string;
  @Input() get compactMode() {
    return this._compactMode;
  }
  set compactMode(val) {
    this._compactMode = val;
    if (val && this.menu?.instance) {
      this.showMenuItemsTooltip = false;
    }
  }
  @Input() items: any[];

  @Output() selectedItemChanged = new EventEmitter<string>();
  @Output() openMenu = new EventEmitter<any>();
  @Output() contextMenu = new EventEmitter<any>();

  public _compactMode = false;
  public showAppointmentPopup: boolean;
  public showMenuItemsTooltip = false;
  public showSmallTooltip = false;
  public tooltipTarget: any;
  public smallTooltipTarget: any;
  public hoveredMenuItem: any;
  public expandedMenuItem: any;
  public selectedKey = 'home';
  store: ODataStore;

  constructor(
    private elementRef: ElementRef,
    public appInfo: AppInfoService,
    private userStore: UserStore,
    private router: Router,
    private authService: AuthService,
  ) {
    super();
    this.subscription.add(
      router.events.subscribe(e => {
        if (e instanceof NavigationEnd && this.checkIfHomePage(e.urlAfterRedirects)) {
          this.focusOnMenu(2);
        }
      })
    );
  }

  public onItemExpanded(e) {
    // if expanded node is a root level menu item (ie no parents), then collapse all other root level menus
    if (e.node.parent === null) {
      const menuNodes = e.component.getNodes();
      // console.table(menuNodes);
      const myExpandedNode = e.node.key;
      menuNodes.forEach((menuNode) => {
        if (menuNode.key !== myExpandedNode && menuNode.expanded === true) {
          this.menu.instance.collapseItem(menuNode.key);
        }
      });
    } else {
      try {
        const menuNodes = e.node.parent.children;
        const myExpandedNode = e.node.key;
        menuNodes.forEach((menuNode) => {
          if (menuNode.key !== myExpandedNode && menuNode.expanded === true) {
            this.menu.instance.collapseItem(menuNode.key);
          }
        });
      } catch (e) { }
    }
  }

  public isBeginGroup(itemObj): boolean {
    if (itemObj.beginGroup === null || itemObj.beginGroup === undefined) {
      return false;
    } else {
      return itemObj.beginGroup;
    }
  }

  ngOnInit() {
    this.selectedKey = sessionStorage.getItem('menuItem');

    if (!this.selectedKey)
      this.selectedKey = 'home';

    this.items.forEach(element => {
      element.selected = false;
    })

    const item = this.items.find(x => x.key == this.selectedKey);

    if (item)
      this.items.find(x => x.key == this.selectedKey).selected = true;
    else {
      switch (this.selectedKey) {
        case 'printing':
        case 'generateBatch':
          this.items.find(x => x.key == 'documents').selected = true;
        break;
      }
    }
  }

  public hideTooltips() {
    this.hoveredMenuItem = undefined;
    this.showMenuItemsTooltip = false;
    this.showSmallTooltip = false;
  }

  showContextMenu(event) {
    this.contextMenu.emit(event);
  }

  public updateSelection(element: HTMLElement) {
    const nodeClass = 'dx-treeview-node';
    const selectedClass = 'dx-state-selected';
    const focusedClass = 'dx-state-focused';
    const disabledClass = 'dx-state-disabled';
    const leafNodeClass = 'dx-treeview-node-is-leaf';

    let component: any = null;
    component = this.menu.instance;

    const useraccess = this.userStore.getAccessKey();

    // go though menu nodes & set to enabled/disabled based on users role
    const menunodes = component.getNodes();
    menunodes.forEach((menunode) => {
      try {
        if (useraccess[menunode.itemData.accessbit - 1] === '1') {
          menunode.itemData.disabled = false;
        } else {
          menunode.itemData.disabled = true;
        }
      } catch (e) { }
      if (menunode.children.length > 0) {
        menunode.children.forEach((menunode2) => {
          try {
            if (useraccess[menunode2.itemData.accessbit - 1] === '1') {
              menunode2.itemData.disabled = false;
            } else {
              menunode2.itemData.disabled = true;
            }
          } catch (e) { }
          if (menunode2.children.length > 0) {
            menunode2.children.forEach((menunode3) => {
              try {
                if (useraccess[menunode3.itemData.accessbit - 1] === '1') {
                  menunode3.itemData.disabled = false;
                } else {
                  menunode3.itemData.disabled = true;
                }
              } catch (e) { }
            });
          }
        });
      }
    });

    const allNodes = element.querySelectorAll(`.${nodeClass}`);
    Array.from(allNodes).forEach((node) => {
      node.classList.remove(selectedClass);
      node.classList.remove(focusedClass);
    });

    const rootNodes = element.querySelectorAll(
      `.${nodeClass}:not(.${leafNodeClass})`
    );
    Array.from(rootNodes).forEach((node) => {
      node.classList.remove(selectedClass);
      node.classList.remove(focusedClass);
    });

    let selectedNode = element.querySelector(`.${nodeClass}.${selectedClass}`);
    while (selectedNode && selectedNode.parentElement) {
      if (selectedNode.classList.contains(nodeClass)) {
        selectedNode.classList.add(selectedClass);
      }

      selectedNode = selectedNode.parentElement;
    }
  }

  clickedOnTopMenuItemWithChildren(item) {
    //collapse or expand
    if (this.expandedMenuItem && this.expandedMenuItem.key === item.key) {
      this.collapseItem(item.key);
      return;
    }
    //clicked one a new item
    this.collapseAllNodes();
    this.expandItem(item.key);

  }
  clickedOnTopMenuItemWithNoChildren(element, item) {
    //clean
    this.hideTooltips();
    this.collapseAllNodes();
    this.expandedMenuItem = undefined;

    //update selection
    this.updateSelection(element);
    this.selectItem(item.key);

    //route
    this.router.navigate([item.path]);
  }

  clickedOnSubMenuItem(element, itemData, parentKey) {
    this.hideTooltips();
    this.updateSelection(element);

    if (itemData.key === 'diary/add-appointment') {
      this.showAppointmentPopup = true;
      return;
    }
    else if (itemData.path) {
      if (itemData.fragment)
        this.router.navigate([itemData.path], {fragment: itemData.fragment});
      else
      this.router.navigate([itemData.path]);
    }

    //if parent not expanded then expand parent
    if (!this.expandedMenuItem || this.expandedMenuItem.key !== parentKey) {
      this.collapseAllNodes();
      this.expandItem(parentKey);
    }

    this.selectItem(itemData.key);
  }

  onItemClick(event) {
    sessionStorage.setItem('menuItem', event.itemData.key);

    const item = event.itemData;

    const hasChildren = event.node.children.length > 0;
    const hasPath = !!item.path;

    if (hasPath && hasChildren) {
      throw 'Can not have an item with children and path.'
    }

    if (hasChildren && !hasPath) {
      this.clickedOnTopMenuItemWithChildren(item);
      return;
    }

    if (!hasChildren && hasPath && !event.node.parent) {
      this.clickedOnTopMenuItemWithNoChildren(event.element, item);
      return;
    }

    this.clickedOnSubMenuItem(event.element, item, event.node.parent.key);
  }

  public showMenuTooltip(tooltipTarget, data) {
    if (!data.items) {
      this.hoveredMenuItem = data;
      this.showMenuItemsTooltip = false;

      if (this.compactMode) {
        this.showSmallTooltip = true;
        this.smallTooltipTarget = tooltipTarget;
      }
      return;
    };

    this.showSmallTooltip = false;

    if (this.hoveredMenuItem && this.hoveredMenuItem.key === data.key) {
      return;
    };

    this.tooltipTarget = tooltipTarget;
    this.showMenuItemsTooltip = true;
    this.hoveredMenuItem = data;
  }

  private selectItem(key: String) {
    setTimeout(() => {
      this.menu.instance.selectItem(key);
    }, 10);
  }

  private collapseAllNodes() {
    this.menu.instance.collapseAll();
  }

  private expandItem(key) {
    this.menu.instance.expandItem(key);
    this.expandedMenuItem = this.items.find(x => x.key === key);
  }

  private collapseItem(key) {
    this.menu.instance.collapseItem(key);
    this.expandedMenuItem = undefined;
  }


  onMenuInitialized(event) {
    event.component.option('deferRendering', false);
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e) => {
      this.openMenu.next(e);
    });

    if (this.checkIfHomePage(this.router.url)) {
      this.focusOnMenu(1);
    }
    else if (this.selectedItem) {
      let key = this.selectedItem;

      const routes = this.selectedItem.split('/');
      key = key.slice(1);

      if (routes.length === 3) { //parent and child
        const parentKey = capitalizeFirstLetter(routes[1]);
        this.expandItem(parentKey);
      }

      this.selectItem(key);
    }
  }


  private focusOnMenu(delay: number) {
    setTimeout(() => {
      this.menu.instance.focus();
    }, delay * 1000);
  }

  private checkIfHomePage(url: string) {
    return url.indexOf('/home') > -1;
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }

  onTooltipShowing(event) {
    event.component._zIndex = 2000;
    event.component._$wrapper[0].style.zIndex = 2000;
    event.component._$wrapper[0].classList.add('left-menu-tooltip');
  }

  private unselectSite(callback?) {
    if (this.userStore.isMedSecUser()) {
      this.subscription.add(
        this.authService.unselectSite().subscribe(() => {
          if (callback) {
            callback();
          }
        })
      );
    }
  }
}

@NgModule({
  imports: [DxTreeViewModule, DxTemplateModule, CommonModule, DxTooltipModule, MatMenuModule, AppointmentPopupAddEditModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule { }
