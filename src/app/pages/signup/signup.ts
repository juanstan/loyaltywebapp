import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AccountService} from '../../providers/account.service';
import {AlertService} from '../../shared/services/alert.service';
import * as moment from 'moment';
import {CountryService} from '../../providers/country.service';
import {Observable} from 'rxjs/internal/Observable';
import {Country} from '../../model/country';
import {RegionService} from '../../providers/region.service';
import {Region} from '../../model/region';
import {CityService} from '../../providers/city.service';
import {City} from '../../model/city';
import {FormControlValidators} from '../../shared/utils/form-validators';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import {countries} from '../../shared/utils/country-data-store';

@Component({
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted: boolean;
  date_of_birth: Date;
  todayDate: string;
  countries: Country[];
  regions: string;
  cities: string;

  preferredCountries = ['ae', 'kw', 'qa', 'bh', 'om'];
  selectFirstCountry = true;
  defaultCountryiso = 'ae';
  userexists: boolean;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private countryService: CountryService,
    private regionService: RegionService,
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.errorMessage = '';
    this.form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', [
        Validators.required, IonIntlTelInputValidators.phone
      ]],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      nationality: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      password_confirmation: ['', Validators.required],
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

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.userexists = false;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data.status === 'error') {
            this.userexists = true;
            this.loading = false;
            this.errorMessage = data.msg;
            return;
          }
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
          this.router.navigate(['../verify'], { relativeTo: this.route });
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

  /*loadRegion(event) {
    const countryID = event?.detail?.value;
    if (countryID) {
      this.regions$ = this.regionService.getRegionsReq(countryID);
    }
  }

  loadCity(event) {
    const cityID = event?.detail?.value;
    if (cityID) {
      this.cities$ = this.cityService.getCitysReq(cityID);
    }
  }
*/

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
