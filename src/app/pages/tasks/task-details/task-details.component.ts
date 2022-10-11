import { Component, Input } from '@angular/core';
import { TaskListViewModel, TaskViewModel } from 'src/app/shared/services/task.service';
import { GenericViewModel } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent {
  @Input() linkTo;
  @Input() patientId: string;
  @Input() siteId: string;
  @Input() invoiceId: string;

  tasks: TaskListViewModel[] = [];
  taskDetails: TaskViewModel = new TaskViewModel();
  refresh = false;
  linkToSelected: GenericViewModel = new GenericViewModel();
  linkedTo: GenericViewModel[] = [];
  
  onFocusedRowChanged(e) {
    this.taskDetails = e.row.data;
  }

  onFocusedRowChanging(e) {
  }

  editComplete(e) {
    this.refresh = true;
  }
}
