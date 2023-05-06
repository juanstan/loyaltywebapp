import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from '../../providers/account.service';
import {AlertService} from '../../shared/services/alert.service';
import * as moment from 'moment';
import {Country} from '../../model/country';
import {FormControlValidators} from '../../shared/utils/form-validators';
import {countries} from '../../shared/utils/country-data-store';

@Component({
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit {
  form: FormGroup;
  loading = false;
  submitted: boolean;
  date_of_birth: Date;
  todayDate: string;
  countries: Country[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.form = this.formBuilder.group({
        name: [this.accountService.userValue.name, Validators.required],
        phone: [this.accountService.userValue.phone, Validators.required],
        email: [this.accountService.userValue.email, Validators.required],
        gender: [this.accountService.userValue.gender, Validators.required],
        nationality: [this.accountService.userValue.nationality, Validators.required],
        country: ['' + this.accountService.userValue.country, Validators.required],
        state: ['' + this.accountService.userValue.state, Validators.required],
        city: ['' + this.accountService.userValue.city, Validators.required],
        date_of_birth: [(new Date(this.accountService.userValue.date_of_birth)).toISOString(), Validators.required],
        password_confirmation: ['', Validators.required],
        // eslint-disable-next-line max-len
        password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*_?&])[A-Za-z\\d@$!%*_?&]{8,}$')]]
      },
      {
        validator: FormControlValidators.match(
          'password',
          'password_confirmation'
        ),
      });

    this.getCountries();

  }

  ionViewDidEnter() {
    // @ts-ignore
    setTimeout(() => this.form.patchValue({country: ['' + this.accountService.userValue.country_id]}), 100);
  }

  // convenience getter for easy access to form fields
  get f() {
    // @ts-ignore
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.update(this.form.value)
      .pipe(first())
      .subscribe({
        next: async () => {
          await this.accountService.loadAllData().subscribe(() => {
            this.loading = false;
          });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  getToday() {
    return new Date();
  }

  getTodayUTC() {
    return new Date().toISOString();
  }


  getData(data) {
    this.form.patchValue({
      date_of_birth: data.detail.value,
    });
  }

  getCountries() {
    this.countries = countries;

  }


  datePickerValueChange(event) {
    if (event?.target && new Date(event.target.valueAsDate) > this.getToday()) {
      event.target.value = this.getToday();
      setTimeout(() => (this.date_of_birth = this.getToday()), 2000);

      this.date_of_birth = this.getToday();
      this.form.patchValue({
        date_of_birth: moment(this.date_of_birth).toISOString(),
      });
      return;
    }
    if (
      (event.target.valueAsNumber === 0 ||
        isNaN(event.target.valueAsNumber))
    ) {
      this.date_of_birth = null;
      this.form.patchValue({
        date_of_birth: null,
      });
      console.log('Setting DOB to null as it was reset');
    }
    if (event.target.valueAsNumber > 0) {
      this.date_of_birth = new Date(event.target.valueAsDate);
      this.form.patchValue({
        date_of_birth: moment(event.target.valueAsDate).toISOString(),
      });
    }
  }
}
