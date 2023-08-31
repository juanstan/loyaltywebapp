import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {timer} from 'rxjs';
import {AlertController} from '@ionic/angular';

@Component({
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild('pickupDate', { read: ElementRef, static: false }) pickupDate?: ElementRef;

  form: FormGroup;
  loading = false;
  submitted: boolean;
  date_of_birth: Date;
  todayDate: string;
  countries: Country[];
  regions: string;
  cities: string;
  day: number;

  preferredCountries = ['ae', 'kw', 'qa', 'bh', 'om'];
  selectFirstCountry = true;
  defaultCountryiso = 'ae';
  userexists: boolean;
  errorMessage: string;
  btnDisable: boolean;

  // dayValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  myDate: string = new Date(new Date().getFullYear(), 0, 1).toISOString();


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private alertCtrl: AlertController,
    private renderer: Renderer2,
    private countryService: CountryService,
    private regionService: RegionService,
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.btnDisable = true;
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

  getDataDay(data){
    this.day = data.detail.value?.split('-')[0]?.slice(-2);
  }

  getData(data) {

    const year = data.detail.value?.split('-')[0];
    const month = data.detail.value?.split('-')[1];
    const date = new Date(`${year}-${month}-${this.day}`);

    this.myDate = date.toISOString();

    this.form.patchValue({
      date_of_birth: date,
    });
  }

  getCountries() {
    this.countries = countries;
  }

  injectClass() {
    timer(1000).subscribe(() => { //async issues I couldn't resolve
      const shadow: DocumentFragment = this.pickupDate?.nativeElement.shadowRoot;
      const shadowSection = shadow.querySelector('ion-picker-column-internal');

      this.renderer.setAttribute(shadowSection, 'part', 'day');
    });
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

  termsAndConditions(event) {
    this.btnDisable = !event.detail.checked;
  }

  async handleTermsAndConditions() {
    const alert = await this.alertCtrl.create({
      cssClass: 'popupg',
      header: 'Terms & Conditions',
      message: 'YALLA REWARDS Programme (“YALLA REWARDS”) is operated by Al Boom Marine LLC for the Al Boom Marine group of Companies. The YALLA mobile application that can be available by scanning the QR code at any of the Al Boom Marine Retail stores or on website at  www.alboommarine.com By accessing and using the YALLA Rewards mobile application and / or the YALLA Website, you have agreed to all Terms.\n' +
        '\n' +
        'DEFINITIONS\n' +
        '\n' +
        '1. The following binding definitions shall apply: \n' +
        '\n' +
        '“Account” means the account where Points of a Member will be Earned/Redeemed accessible on the YALLA Rewards mobile application and / or YALLA Website.\n' +
        '\n' +
        '“Earn” or “Earning” is when a Member is rewarded with Points for making a Qualifying Transaction at a Participating Brand.\n' +
        '\n' +
        '“Enrollment Date” means the date the Member successfully registered with YALLA.\n' +
        '\n' +
        '“Family Group” means a YALLA feature that enables Family Members to YALLA points with each other.\n' +
        '\n' +
        '“Gift” means moving points from one YALLA Account to another.\n' +
        '\n' +
        '“Member” and /or “You” means a person who has successfully registered a YALLA Account.\n' +
        '\n' +
        '“Participating Brand” means, Beyond The Beach, RIP Curl, GIANT, Tommy Bahama, Reebok, Owndays, Beyond The Bike, Beyond The Street, Beyond The Beach Ocean, Oakley, New ERA, Seafolly.\n' +
        '\n' +
        '“Partner Programmes” means rewards programmes or related companies external to YALLA, with whom YALLA has an agreement to enhance Earning and Redeeming opportunities for Members.\n' +
        '\n' +
        '“Points” means the value of the rewards programme currency which are accrued by Members of YALLA for making a Qualifying Transaction.\n' +
        '\n' +
        'The “Minimum Redemption Amount” is 100 YALLA Points (worth 3 AED) to be used against a purchase.\n' +
        '\n' +
        '“Privacy Policy” means the terms and conditions describing how Al Boom Marine gathers, uses, discloses, and manages its private customer\'s data as outlined in Clause 14.0 below.\n' +
        '\n' +
        '“Qualifying Transaction” means a successful transaction within a Participating Brand post the YALLA Operational Date.\n' +
        '\n' +
        '“Redeem” or “Redeeming” is when a Member uses their Points to pay for goods or services in part or in full in Participating Brands.\n' +
        '\n' +
        '“YALLA ID” means the barcode within the YALLA Rewards mobile application.\n' +
        '\n' +
        'GENERAL\n' +
        'Al Boom Marine LLC reserves the right to change, modify or amend any part of YALLA at any time. This right includes, but is not limited to, the Al Boom Marine LLC partner affiliation, rules for Earning and Redeeming points, rules for use of rewards, benefits, procedures, and specific features of promotional offers. Reasonable efforts will be made to ensure the latest version of is posted on the YALLA Rewards mobile application and / or YALLA Website. \n' +
        '\n' +
        'Other terms:\n' +
        'No Card will be considered for this Campaign if the customer has not met all the terms (‘Campaign Eligibility Criteria’) of this offer.\n' +
        'The fulfilment for Eligible Customers will be done directly by ABM YALLA in YALLA APP as YALLA Points and no cash equivalent of the points will be credited to the card.\n' +
        'This Campaign offer cannot be combined with any other campaign for the respective products during the time of campaign or prior to the campaign or after this campaign is finished.\n' +
        'Any Card booked/issued prior to the campaign launch or prior to Campaign Start date will not be eligible for this offer.\n' +
        'Any Replacement or Renewal of an existing card issued prior to the Campaign Offer will not be eligible for this campaign\n' +
        '\n' +
        '\n' +
        'FAIR USE\n' +
        '\n' +
        'YALLA is to reward and benefit individual Members who transact with the Participating Brands for their individual transactions. For the avoidance of doubt, members are not eligible to earn Points for transactions that are not their own, whether using the YALLA Wallet or receipt scanning functionality.\n' +
        '\n' +
        'No collective group use is permitted of YALLA, expect where specifically included in the Terms.\n' +
        '\n' +
        'No corporate use is permitted i.e. collection or use of Points or benefits for business purposes is not permitted.\n' +
        '\n' +
        'All exceptional use i.e points, Earning, Redeeming, refunding or use of other benefits will be flagged and may lead to suspension of the related Account whilst the activity is under verification.\n' +
        '\n' +
        'Any misuse of from YALLA its original intention and any action or omission against the fair use terms may lead to permanent deletion of the related YALLA Account and forfeiture of any Points outstanding.\n' +
        '\n' +
        'ABM reserves the right to pursue individuals, companies, or other organisations for legal recourse if the programme is mis-used.\n' +
        '\n' +
        'ABM reserves the right to suspend, delete or otherwise modify any Member’s Account, or the entire YALLA programme at any time at its sole discretion, with or without prior notification. This may lead to a forfeiture of all outstanding points, promotions and benefits.\n' +
        '\n' +
        'PRIVACY POLICY\n' +
        '\n' +
        'ABM shall endeavor to diligently protect a Member’s privacy. By using YALLA, it is assumed that you have read, understood, and agreed to ABM Privacy Policy.',
      buttons: [{
        text: 'Okay'
      }],
    });
    await alert.present();
  }


}
