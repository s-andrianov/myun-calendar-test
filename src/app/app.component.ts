import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

export class CalendarDay {
  public date: Date;
  public title: string;
  public isPastDate: boolean;
  public isToday: boolean;
  public isNotCurrent: boolean;

  public getDateString() {
    return this.date.toISOString().split('T')[0];
  }

  constructor(d: Date, isNotCurrent: boolean = false) {
    this.date = d;
    this.isNotCurrent = isNotCurrent;
    this.isPastDate = d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    this.isToday = d.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  }
}

@Pipe({
  name: 'chunk',
})
export class ChunkPipe implements PipeTransform {
  transform(calendarDaysArray: any, chunkSize: number): any {
    let calendarDays = [];
    let weekDays = [];

    calendarDaysArray.map((day, index) => {
      weekDays.push(day);
      if (++index % chunkSize === 0) {
        calendarDays.push(weekDays);
        weekDays = [];
      }
    });
    return calendarDays;
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  public monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  public displayMonth: string;
  public displayYear: number;
  private monthIndex: number = 0;
  private yearIndex: number = 0;

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex, this.yearIndex);
  }

  private generateCalendarDays(monthIndex: number, yearIndex: number): void {
    this.calendar = [];

    let currentDate = new Date();
    let year = currentDate.getFullYear() + yearIndex;
    let month = currentDate.getMonth() + monthIndex;

    // Adjust year and month if monthIndex goes out of bounds
    if (month > 11) {
      year++;
      month -= 12;
    } else if (month < 0) {
      year--;
      month += 12;
    }

    let day = new Date(year, month, 1);
    this.displayMonth = this.monthNames[day.getMonth()];
    this.displayYear = day.getFullYear();

    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;

    for (let i = 0; i < 42; i++) {
      let isNotCurrent = dateToAdd.getMonth() !== month;
      this.calendar.push(new CalendarDay(new Date(dateToAdd), isNotCurrent));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  private getStartDateForCalendar(selectedDate: Date): Date {
    let lastDayOfPreviousMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      0
    );

    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(
          startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1)
        );
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

  public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex, this.yearIndex);
  }

  public decreaseMonth() {
    this.monthIndex--;
    this.generateCalendarDays(this.monthIndex, this.yearIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.yearIndex = 0;
    this.generateCalendarDays(this.monthIndex, this.yearIndex);
  }
}
