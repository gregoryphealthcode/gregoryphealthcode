import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { WorkDayInputModel } from '../services/site-practice-hours.service';

export const titleToGender = (title: string) =>{
  title = title.toLowerCase();
  const maleTitles = ['mr', 'sir', 'lord'];
  const femaleTitles = ['mrs', 'ms', 'mis', 'lady'];

  if(maleTitles.includes(title)) {
    return 'male';
   }

   if(femaleTitles.includes(title)) {
    return 'female';
   }

   return 'other';
};

export const showSuccessSnackbar = (snackBar: MatSnackBar, message: string) =>{
  snackBar.open(
    message,
    'Close',
    {
      panelClass: 'badge-success',
      duration: 3000,
    }
  );
};
export const showErrorSnackbar = (snackBar: MatSnackBar) =>{
  snackBar.open('An error occurred', 'Close', {
    panelClass: 'badge-danger',
    duration: 3000,
  });
};

export const showErrorSnackbarWithMessage = (snackBar: MatSnackBar, message : string) =>{
  snackBar.open(message, 'Close', {
    panelClass: 'badge-danger',
    duration: 3000,
  });
};

export const calculateAgeValue = (birthDate) => {
  try {
    if (typeof birthDate === 'string') {
      const timeDiff = Math.abs(
        Date.now() - new Date(birthDate).getTime()
      );
      const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      return age;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const capitalizeEachWord = (string) => {
   //split the value of this input by the spaces
   const split = string.split(' ');

   //iterate through each of the "words" and capitalize them
   for (var i = 0, len = split.length; i < len; i++) {
       split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
   }

   //re-join the string and set the value of the element
   return split.join(' ');
}



export class InputNotifier {
  valueChanged: () => void = () => { };
}


export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}


function stream(name, delay, count) {
  let s = timer(0, delay).pipe(map((v) => v + `-${name}`));
  if (count !== -1) {
      s = s.pipe(take(count));
  }
  return s;
}

function streamTest(){
  const a = this.stream('a', 1000, 3);
  const b = this.stream('b', 1000, 3);
  const c = this.stream('c', 1000, 3);
  const d = this.stream('d', 1000, 3);

  const arr1 = [a,b];

  merge(...arr1, c, d).subscribe(x=> console.log(x));
}

export const timeToDate = (time: string): Date => {
  if (!time) {return undefined; }

  let date = new Date(2000, 0, 1, 0, 0, 0);
  const currentDate = date.toISOString().slice(0, 10);
  date = new Date(currentDate + ' ' + time);
  return date;
};

export const timeToIsoDate = (time: string): string => {
  if (!time) {return undefined; }
  return timeToDate(undefined).toISOString();
};

export const timeToHoursAndMinutes = (time: string): {hour, min} => {
  if (!time) {return undefined; }

  const date = timeToDate(time);
  const hour = date.getHours();
  const min  = date.getMinutes();
  return {hour, min};
};

export const dateInsideWorkDay = (date: Date, workDay: WorkDayInputModel): boolean => {
  if (!date) {return false }

  const hours = date.getHours();
  const minutes = date.getMinutes();

  if(hours >= workDay.startTime.hours && hours <=workDay.endTime.hours){
    return true;
  }

  return false;
};
