import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  host: { class: 'd-flex flex-column flex-grow-1' }
})
export class TasksComponent implements OnInit {
  constructor(
  ) 
  { 
  }

  ngOnInit() {
  }
}
