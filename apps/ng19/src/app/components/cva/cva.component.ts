import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateStringFormat = 'YYYY-MM-DD';
const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Component({
  selector: 'date-input',
  imports: [ReactiveFormsModule],
  templateUrl: './cva.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CvaComponent),
      multi: true,
    },
  ],
})
export class CvaComponent implements ControlValueAccessor {
  readonly minYear = 1900;
  currentYear = new Date().getFullYear();
  months = months;
  disabled = false;
  formGroup = new FormGroup({
    month: new FormControl<string>('', [
      Validators.required,
      Validators.min(1),
      Validators.max(12),
    ]),
    day: new FormControl<string>('', [
      Validators.required,
      Validators.min(1),
      Validators.max(31),
    ]),
    year: new FormControl<string>('', [
      Validators.required,
      Validators.min(this.minYear),
      Validators.max(this.currentYear),
    ]),
  });
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const { day, month, year } = value;
        const isValid = this.validateDate(
          `${year}-${this.padValue(month)}-${this.padValue(day)}`,
        );
        if (isValid) {
          this.onChange(
            dayjs(
              `${year}-${this.padValue(month)}-${this.padValue(day)}`,
            ).format(dateStringFormat),
          );
        } else {
          this.onChange('Invalid date');
        }
        this.onTouch();
      });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    if (this.validateDate()) {
      const date = dayjs(value, dateStringFormat);
      this.formGroup.setValue({
        day: date.date().toString(),
        month: (date.month() + 1).toString(),
        year: date.year().toString(),
      });
    }
  }

  private validateDate(date?: string | null) {
    if (!date) {
      return false;
    }

    return dayjs(`${date}`, dateStringFormat, true).isValid();
  }

  private padValue(value?: string | null) {
    if (!value) {
      return '';
    }

    return value.length === 1 ? `0${value}` : value;
  }
}
