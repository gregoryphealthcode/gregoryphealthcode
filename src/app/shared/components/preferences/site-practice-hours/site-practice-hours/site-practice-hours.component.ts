import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ReactiveFormBase } from 'src/app/shared/base/reactiveForm.base';
import { timeToHoursAndMinutes } from 'src/app/shared/helpers/other';
import { SitePracticeHoursService, WorkDayInputModel, WorkDayTime } from '../site-practice-hours.service';

@Component({
  selector: 'app-site-practice-hours',
  templateUrl: './site-practice-hours.component.html',
  styleUrls: ['./site-practice-hours.component.scss']
})
export class SitePracticeHoursComponent extends ReactiveFormBase implements OnInit {
  public days = getDaysArray();

  constructor(private dataService: SitePracticeHoursService,
    private formBuilder: FormBuilder) {super(); }

  httpRequest = (x) => {
    return this.dataService.setSitePracticeHorus(x);
  }

  ngOnInit() {
    this.setForm();

    this.subscription.add(
      this.dataService.getCurrentSitePracticeHours().subscribe(
        x => {
          if(x && x.length > 0){
            this.addWorkdays(buildWorkingDays(x));
          }
          else{
            this.addWorkdays(buildDefaultWorkingDays());
          }

        }
      )
    );
  }

  private setForm() {
    this.editForm = this.formBuilder.group({
      days: new FormArray([]),
    });
  }

  protected addWorkdays(workDays: WorkDayInputModel[]) {
    workDays.forEach((workDay) => {

      const formGroup =  new FormGroup({
        day: new FormControl(workDay.day),
        working: new FormControl(workDay.working),
        startTime: new FormControl(workDay.startTime.toViewString()),
        endTime: new FormControl(workDay.endTime.toViewString())
      })

      this.workDaysFormArray.push(
        formGroup
      );
    });
  }

  protected getModelFromForm() {
    const record = super.getModelFromForm();

    record.days.forEach(
      (element: { startTime: any; endTime: any, breaks: any }) => {
        if (element.startTime) {
          const time = timeToHoursAndMinutes(element.startTime);
          element.startTime = new WorkDayTime(time.hour, time.min);
        }

        if (element.endTime) {
          const time = timeToHoursAndMinutes(element.endTime);
          element.endTime = new WorkDayTime(time.hour, time.min);
        }

        if(element.breaks){
          element.breaks.forEach(x => {
            let time = timeToHoursAndMinutes(x.startTime);
            x.startTime = new WorkDayTime(time.hour, time.min);

            time = timeToHoursAndMinutes(x.endTime);
            x.endTime = new WorkDayTime(time.hour, time.min);
          });


        }
      }
    );
    return record;
  }

  get workDaysFormArray() {
    return this.editForm.controls.days as FormArray;
  }

}


export const buildDefaultWorkingDays = (): WorkDayInputModel[] => {
  const days: WorkDayInputModel[] =  [];
  const startTime = new WorkDayTime(9, 0);
  const endTime = new WorkDayTime(17, 0);
  for (let index = 0; index < 7; index++) {
      days.push({
        day: index + 1,
        working: index < 5,
        startTime,
        endTime
      });
    }

  return days;
};

export const buildWorkingDays = (workDays: WorkDayInputModel[]): WorkDayInputModel[] => {
  const days: WorkDayInputModel[] =  [];
  const defaultStartTime = new WorkDayTime(9, 0);
  const defaultEndTime = new WorkDayTime(17, 0);
  for (let index = 0; index < 7; index++) {
    const workingDay = workDays.find(x => x.day === index + 1);
    const working = workingDay ? workingDay.working : false;
    const startTime = workingDay ? Object.assign(new WorkDayTime(), workingDay.startTime) : defaultStartTime;
    const endTime = workingDay ? Object.assign(new WorkDayTime(), workingDay.endTime) : defaultEndTime;

    days.push(
      {day: index + 1, working, startTime, endTime}
    )
    }
  return days;
};

export const getDaysArray = (): string[] => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
};

