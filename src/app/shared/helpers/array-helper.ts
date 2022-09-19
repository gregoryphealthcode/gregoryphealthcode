import { HttpParams } from '@angular/common/http';

export const sumBy = (arr: any[], propertyName: string): number => {
  if (arr.length === 0) { return 0; }
  const toReturn = arr.map(x => x[propertyName]).reduce((a, b) => a + b);
  return toReturn;
};

export const sortBy = (arr: any[], propertyName: string) => {
  arr = arr.sort((a, b) => (a[propertyName] > b[propertyName]) ? 1 : -1);
  return arr;
};

export const groupBy = (arr: any[], lambda: any) => {
  return arr.reduce((r, v, i, a, k = lambda(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
};

export const sortByDesc = (arr: any[], propertyName: string) => {
  arr = arr.sort((a, b) => (a[propertyName] < b[propertyName]) ? 1 : -1);
  return arr;
};

export const arrToParams = (arr: number[], arrName: string): HttpParams => {
  let payload = new HttpParams();

  arr.forEach((id: number) => {
    payload = payload.append(arrName, id.toString());
  });

  return payload;
};

export const ToIdValueViewModel = (dataResponse: any, propertyName: string) => {
  const records = dataResponse.data as any[];
  return records.map(y => ({id : y.id, value: y[propertyName]}));
};

export const valuesToParams = (arr: {name: string, value: any}[]): HttpParams => {
  let payload = new HttpParams();

  arr.forEach(e => {
    if (e.value) {
      payload = payload.append(e.name, e.value);
    }
  });

  return payload;
};


export const filterByMaxYear = (records: any[], propertyName: string): any[] => {
  records.forEach(
    x=> {
      x.jsDate = new Date(x[propertyName]);
      //x.month = x.jsDate.getMonth() + 1;
      x.year = x.jsDate.getFullYear();
    }
  )

  const yearGroup = groupBy(records, x=> x.year);
  const arr = Object.getOwnPropertyNames(yearGroup).map(x=>Number(x));
  let max = Math.max(...arr);
  return yearGroup[max];
};

export const toMonthData = (records: any[], propertyName: string): any[] => {
  records.forEach(
    x=> {
      x.jsDate = new Date(x[propertyName]);
      x.month = x.jsDate.getMonth();
    }
  )

  const monthsGrouping = groupBy(records, x=> x.month);

  let monthData = defaultMonthData;

  for (let index = 0; index < monthData.length; index++) {
    const recordsInMonth = monthsGrouping[index];
    if (recordsInMonth){
      monthData[index].count = recordsInMonth.length;
    }
  }
  return monthData;
};



export class MonthData {
  month: string;
  count: number;
}

let defaultMonthData: MonthData[] = [{
  month: "Jan",
  count: 0
}, {
  month: "Feb",
  count: 0
}, {
  month: "Mar",
  count: 0
}, {
  month: "April",
  count: 0
}, {
  month: "May",
  count: 0
}, {
  month: "Jun",
  count: 0
}, {
  month: "July",
  count: 0
}, {
  month: "Aug",
  count: 0
}, {
  month: "Sep",
  count: 0
}, {
  month: "Oct",
  count: 0
}, {
  month: "Nov",
  count: 0
}, {
  month: "Dec",
  count: 0
}
];

