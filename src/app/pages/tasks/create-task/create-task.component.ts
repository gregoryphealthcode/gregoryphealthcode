import { Component, OnInit, OnChanges, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { AppInfoService } from 'src/app/shared/services';
import { GenericViewModel, UserService } from 'src/app/shared/services/user.service';
import { TaskService, TaskListViewModel, TaskViewModel } from 'src/app/shared/services/task.service';
import { SubscriptionBase } from 'src/app/shared/base/subscribtion.base';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['create-task.component.scss']
})

export class CreateTaskComponent extends SubscriptionBase implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() invoiceId: string;
  @Input() patientId: string;
  @Input() siteId: string;
  @Input() taskDetails: TaskViewModel;

  @Output() editComplete = new EventEmitter();

  form: FormGroup;
  linkToSelected: GenericViewModel = new GenericViewModel();
  linkedTo: GenericViewModel[] = [];
  tasks: TaskListViewModel[] = [];
  isCompleted = false;
  taskTypes: GenericViewModel[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private taskService: TaskService,
    private userService: UserService,
    private appInfo: AppInfoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupForm();
    this.taskDetails.isComplete = false;
    if (this.isEdit) {
      this.populateForm(this.taskDetails);
    }
    let linked: GenericViewModel;
    linked = { description: 'Invoice', uniqueNo: 1, siteId: null, id: '1' };
    this.linkedTo.push(linked);
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.getTaskTypes();
  }

  getTaskTypes() {
    this.subscription.add(this.userService.getTaskTypes().subscribe(data => {
      this.taskTypes = data;
      this.changeDetectorRef.detectChanges();
    }));
  }

  getDateFormat(): string {
    return this.appInfo.getDateFormatBySite(this.siteId);
  }

  add() {
    this.taskDetails = new TaskViewModel();
    this.taskDetails.isComplete = false;
  }
  save() {
    const taskDetails = new TaskViewModel();
    taskDetails.isComplete = this.form.get('complete').value ?? false;
    if (taskDetails) {
      taskDetails.status = 'Completed';
    }
    else {
      taskDetails.status = 'Not Started';
    }

    taskDetails.siteId = this.siteId;
    taskDetails.invoiceId = this.invoiceId;
    taskDetails.patientId = this.patientId;

    taskDetails.dueDateTime = this.form.get('followUp').value;
    taskDetails.linkTo = this.form.get('linked').value;
    taskDetails.note = this.form.get('comments').value;
    taskDetails.taskType = this.form.get('taskType').value;
    taskDetails.taskTypeId = this.form.get('taskType').value;
    taskDetails.percentageComplete = this.form.get('percentageComplete').value;

    this.subscription.add(this.taskService.updateTask(taskDetails).subscribe(data => {
      this.tasks = data;
      this.taskDetails = new TaskViewModel();

      this.changeDetectorRef.detectChanges();
      notify('Task saved successfully.', 'success');
      this.form.reset();
      this.editComplete.emit();
    }));
  }


  firstLetterCaps(e) {
    let textcontent =
      e.component._$textEditorInputContainer[0].firstChild.value;
    if (textcontent.length === 1) {
      textcontent = textcontent.toUpperCase();
    }
    if (textcontent.length > 2) {
      if (
        textcontent[textcontent.length - 2] === ' ' ||
        textcontent[textcontent.length - 2] === '\''
      ) {
        let s = '' + textcontent[textcontent.length - 1];
        s = s.toUpperCase();
        textcontent = textcontent.slice(0, textcontent.length - 1);
        textcontent = textcontent + s[0];
      }
    }
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }

  allCaps(e) {
    let textcontent =
      e.component._$textEditorInputContainer[0].firstChild.value;
    textcontent = textcontent.toUpperCase();
    e.component._$textEditorInputContainer[0].firstChild.value = textcontent;
  }


  private setupForm() {
    this.form = new FormGroup({
      linked: new FormControl(null, [Validators.required]),
      followUp: new FormControl(null, [Validators.required]),
      comments: new FormControl(null, [Validators.maxLength(250)]),
      taskType: new FormControl(null, [Validators.required]),
      percentageComplete: new FormControl(null, null),
      complete: new FormControl(null, null),

    });
  }

  public hasError = (controlName: string) => {
    return this.form.get(controlName).hasError('required');
  }

  populateForm(value: TaskViewModel) {
    this.form.patchValue({ linked: value.linkTo });
    this.form.patchValue({ followUp: value.dueDateTime });
    this.form.patchValue({ comments: value.note });
    this.form.patchValue({ taskType: value.taskTypeId });
    this.form.patchValue({ percentageComplete: value.percentageComplete });
    this.form.patchValue({ complete: value.isComplete });
  }
}