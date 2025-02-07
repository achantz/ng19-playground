import { Component } from '@angular/core';
import { CvaComponent } from './components/cva/cva.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [CvaComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ng19';
  formGroup = new FormGroup({
    date: new FormControl<Date>(new Date()),
  });

  constructor() {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(console.log);
  }
}
