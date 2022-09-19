import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TaskService {
    constructor(private router: Router, private http: HttpClient) {
    }
    public getTasksForPatientAndArea(patientId : string, linkId : string): Observable<TaskListViewModel[]> {
        const url = `${environment.baseurl}/tasks/getTasksForPatientAndArea/${patientId}/${linkId}`;

        return this.http.get<TaskListViewModel[]>(url);
    }

    public getTasksForSite(siteId : string): Observable<TaskListViewModel[]> {
        const url = `${environment.baseurl}/tasks/getTasks/${siteId}`;

        return this.http.get<TaskListViewModel[]>(url);
    }

    public updateTask(model : TaskViewModel) : Observable<TaskListViewModel[]> 
    {
        const url = `${environment.baseurl}/tasks/updateTask`;
        return this.http.post<TaskListViewModel[]>(url, model);
    }
}

export class TaskListViewModel
{
    description : string;
    dueDateTime : Date;
    taskType : string;
    notes : string;
    taskId : string;
    isComplete : boolean;
    patientId : string;
    invoiceNumber : string;
    percentageComplete : number;
}

export class TaskViewModel
{
    description : string;
    dueDateTime : Date;
    taskType : string;
    linkTo : string;
    note : string;
    taskTypeId : string;
    isComplete : boolean;
    siteId : string;
    patientId : string;
    status : string; //Not Started / In-Progress / Delayed / Complete
    taskId : string;
    invoiceId : string;
    percentageComplete : number;
}
