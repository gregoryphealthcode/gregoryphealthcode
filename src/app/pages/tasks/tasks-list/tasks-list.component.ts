import { OnInit, Component, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { TaskService, TaskViewModel, TaskListViewModel } from '../../../shared/services/task.service';
import { DxPopupComponent } from 'devextreme-angular';
import { SitesStore } from '../../../shared/stores/sites.store';
import { AppInfoService } from '../../../shared/services';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})

export class TasksListComponent extends SubscriptionBase implements OnInit {
  @ViewChild('editTaskPopup') editTaskPopup: DxPopupComponent;

  @Input() linkTo: string;
  @Input() refresh: boolean;
  @Input() patientId: string;
  @Input() siteId: string;

  taskDetails: TaskViewModel = new TaskViewModel();
  tasks: TaskListViewModel[] = [];
  isEditTasksVisible: boolean;
  showEdit: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private taskService: TaskService,
    public appInfo: AppInfoService,
    private siteStore: SitesStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.siteId = this.siteStore.getSelectedSite().siteId;
    this.getTasks();
  }

  onFocusedRowChanged(e) {
    console.log(e);
  }
  onFocusedRowChanging(e) {
    console.log(e);
  }

  edit(e) {
    this.taskDetails = e;
    this.showEdit = true;
  }

  getTasks() {
    if (this.patientId !== undefined && this.patientId !== null) {
      this.subscription.add(this.taskService
        .getTasksForPatientAndArea(this.patientId, this.linkTo)
        .subscribe(data => {
          this.tasks = data;
          this.changeDetectorRef.detectChanges();
        }));
    } else {
      this.subscription.add(this.taskService.getTasksForSite(this.siteId).subscribe(data => {
        this.tasks = data;
        this.changeDetectorRef.detectChanges();
      }));
    }
  }

  format(value) {
    return '' + value * 100 + '%';
  }
}