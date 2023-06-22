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
      header: 'Terms & COnditions',
      message: '1. Introduction:\n' +
        '\n' +
        'This website beyondthebike.ae, (“Website”), is owned and operated by Beyond The Beach LLC, trading as Beyond The Beach, a limited liability company duly organized under the laws of the United Arab Emirates (“UAE”), under the Commercial License number 522275, whose registered address is at P.O. Box 30439, Dubai, United Arab Emirates.\n' +
        '\n' +
        'For the purposes of these Terms and Conditions “Beyond The Beach”, “We”, “Our” and “Us” refers to Beyond The Beach LLC. Please review these Terms and Conditions carefully before using this Website. Your use of this Website indicates your agreement to be bound by these Terms and Conditions.\n' +
        '\n' +
        'We may amend these Terms and Conditions at any time without any notice, and such amendments become effective from the date upon which We make them available on the Website. Please check this Website periodically for updates to these Terms and Conditions.\n' +
        '\n' +
        'These Terms and Conditions apply whether you are accessing this Website though a computer system, via a mobile device or by using any app that is provided by Us.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '2. Limited License:\n' +
        '\n' +
        'You are granted a limited, non-exclusive, revocable and non-transferable license to utilize and access the Website pursuant to the requirements and restrictions of these Terms and Conditions. We may change, suspend, or discontinue any aspect of the Website at any time. We may also, without notice or liability, impose limits on certain features and services or restrict your access to all or portions of the Website. You shall have no rights to the proprietary software and related documentation, if any, provided to you in order to access the Website. Except as provided in the Terms and Conditions, you shall have no right to directly or indirectly, own, use, loan, sell, rent, lease, license, sub-license, assign, copy, translate, modify, adapt, improve, or create any new or derivative works from, or display, distribute, perform, or in any way exploit the Website, or any of its contents (including software) in whole or in part.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '3. Data Protection:\n' +
        '\n' +
        'We, at Beyond the Beach, respect your right to privacy and your desire for a secure online shopping experience. Any personal information (“Personal Information”) you supply to Us when you register with Us and/or use this Website will be used in accordance with Our Privacy Policy (“Privacy Policy”). By providing your Personal Information to Us, you signify your acceptance of this Privacy Policy and agree that We may collect use and disclose your Personal Information as described in the Privacy Policy.\n' +
        'Our Privacy policy will be continuously assessed to help adapt with new technologies, business practices and our customer needs. For these reasons, we may amend this Privacy Policy at any time without any notice and such amendments become effective from the date upon which we make it available on the Website. Please check this Website periodically for updates to Our Privacy Policy. If you do not agree with Our Privacy Policy, please cease immediately the use of this Website.\n' +
        'If you are aged under 18 you must let your parent or legal guardian know about our Privacy Policy before you register/use this Website or any of the services.\n' +
        'The following states our Privacy Policy.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '4. Intellectual Property:\n' +
        '\n' +
        'All content available on the Website, including, but not limited to, text, graphics, logos, buttons, icons, images, audio clips, data compilations, and software, and the compilation thereof (“Content”) is the property of Beyond The Beach, Our affiliates, Our partners or Our licensors, and is protected by the applicable laws and regulations.\n' +
        'The trade marks, logos, and service marks displayed on the Website (“Trade Marks”) are the registered and unregistered marks of Beyond The Beach, Our affiliates, Our licensors or Our partners, in the UAE and other countries, and are protected by UAE and international trade mark laws. All or any other trademarks not owned by Us, our affiliates, our partners or our licensors that appear on the Website are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by Us.\n' +
        '\n' +
        'Except as set forth in the limited license in the section entitled “Limited License” above, or as required under applicable law, neither the Content, the Trade Marks, nor any other portion of the Website may be used, reproduced, duplicated, copied, sold, resold, accessed, modified, or otherwise exploited, in full or in part, for any purpose without Our prior written consent.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '5. Use of the Website:\n' +
        '\n' +
        'You may only use this Website in accordance with these Terms and Conditions and, in any event, for lawful and proper purposes which includes complying with all applicable laws and regulations of the UAE or other jurisdiction from which you are accessing this Website.\n' +
        '\n' +
        'YOU MUST NOT:\n' +
        '• conduct or promote any illegal activities while using this Website. This includes any activities such as breach of copyright, infringe on privacy or infringe any third-party rights as well as activities that are defamatory to third persons; or\n' +
        '• use this Website to generate unsolicited emails, spam or promotional materials to other users; or\n' +
        '• do anything to cause damage to this Website or other users of the Website, including any technical damage to the other computers; or\n' +
        '• send any viruses or other material designed to adversely affect the operation of the Website, affect any other users of the Website or affect any equipment or any data in the Website; or\n' +
        '• attempt to gain access to the Website or the system that runs the Website; or\n' +
        '• interfere with the security of the Website, its services, system resources or network; or\n' +
        '• use the Website in any manner that could damage, overburden or impair the Website nor harvest or otherwise collect any information about the uses; or\n' +
        '• link to the Website without seeking our prior written consent; or\n' +
        '• frame the Website on another website without seeking our prior written consent; or\n' +
        '• charge third parties for accessing the content of the Website, nor can you in any way commercialize its content; or\n' +
        '• change, edit, add to or produce summaries of its content anywhere else; or\n' +
        '• disclose your contact details including but not limited to phone numbers, addresses, or email addresses anywhere on the Website including the feedback area, discussion forum or through any e-mail feature of the Website intended to bypass use of the Website.\n' +
        'It is illegal to place orders under a false name, with a fraudulently obtained credit card or without the consent of the cardholder. Where We believe (in Our absolute discretion) that you are in breach of any of these Terms and Conditions, without prejudice to any of Our other rights (whether at law or otherwise), We reserve the right to:\n' +
        '• Cancel your orders and/or bookings without reference to you; and/or\n' +
        '• Deny you access to this Website.\n' +
        'We will take reasonable measures to ensure constant availability of the Website; however, we do not warrant that this Website will be always available and that it will operate without any interruption due to connectivity issues or other. We reserve the right to restrict the use or suspend the use of this Website from time to time to complete update, repairs or maintenance of the Website.\n' +
        'We may make improvements or changes to the information, services, products and other materials on this Website, or terminate this Website, at any time without notice. We may also modify these Terms and Conditions at any time, and such modification shall be effective immediately upon posting of the modified Terms and Conditions on this Website. Please check this Website periodically for updates to these Terms and Conditions. Accordingly, your continued access or use of this Website is deemed to be your acceptance of the modified Terms and Conditions.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '6. Security:\n' +
        '\n' +
        'While We take all reasonable measures to ensure that this Website is safe to use, we do not warrant that this Website is virus free or free from any other things which may be of a damaging nature. We shall not be held responsible for any loss or damage caused by a virus or other material that may be harmful to your equipment or data as result of your use of this Website.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '7. Links to Other Websites:\n' +
        '\n' +
        'This Website may include links to other internet sites. We do not endorse any such Websites and We are not responsible for the information, material, products or services contained on or accessible through those Websites. Your access and use of such Websites remain solely at your own risk.\n' +
        '\n' +
        'You may only link to this Website with Our express written permission. We expressly reserve the right to withdraw Our consent at any time to a link which in Our sole opinion is inappropriate or controversial.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '8. Representations and Warranties: Limitation of Liability\n' +
        '\n' +
        'Nothing in these Terms and Conditions is intended to affect your rights as a consumer under the laws of the UAE.\n' +
        'The use of the Website or any of the services or products available thereon is at your own risk, and unless otherwise stated in these Terms and Conditions, you assume full responsibility and risk of loss resulting from your use of the Website or any of the services or products available thereon.\n' +
        'UNDER NO CIRCUMSTANCES, SHALL BEYOND THE BEACH OR ANY OF ITS AFFILIATES, EMPLOYEES, DIRECTORS, OFFICERS BE LIABLE TO YOU OR TO ANY OTHER PERSON FOR ANY INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL LOSSES OR DAMAGES OF ANY NATURE ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE WEBSITE, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, WORK STOPPAGE, ACCURACY OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION, EVEN IF AN AUTHORIZED REPRESENTATIVE OF BEYOND THE BEACH HAS BEEN ADVISED OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES. SUBJECT TO THE FOREGOING, IN NO EVENT WILL BEYOND THE BEACH OR ANY OF ITS AFFILIATES, EMPLOYEES, DIRECTORS, OFFICERS BE LIABLE FOR ANY DAMAGES IN EXCESS OF THE AMOUNT PAID BY YOU TOWARDS THE PRICE OF THE PRODUCT IN RESPECT TO WHICH THE CLAIM AROSE. YOU HEREBY RELEASE US FROM ANY AND ALL OBLIGATIONS, LIABILITES AND CLAIMS IN EXCESS OF THIS LIMITATION.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '9. Orders:\n' +
        '\n' +
        'When you make a purchase through Beyond The Bike Website, you are offering to buy products for the price stated, subject to these Terms and Conditions. All orders are subject to acceptance and availability.\n' +
        '\n' +
        'Within 1 day of our receipt of your order, you will receive a confirmation of your order by email, along with your order reference number.\n' +
        'Beyond The Beach reserves the right to withdraw any products from the Website and may, in its sole discretion, refuse to process an order for any reason at any time. Without prejudice to your statutory rights as a consumer, we will not be liable to you or a third party by reason of us withdrawing any product or refusing to process any order.\n' +
        'We hold the right to cancel any order fully or partially in case the order contains more than 2 pieces of the same product. If We cancel an order it will be without charge to you.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '10. Price and Payment:\n' +
        '\n' +
        'All prices are quoted in United Arab Emirates Dirham (AED). Except in the case of manifest error, the prices payable for Products that you order are as set out on the Website at the time at which you place your order. If We discover an error in the price of products you have ordered, we will contact you as soon as possible. You will have the option of either confirming your order at the correct price or cancelling it. If We are unable to contact you, we will treat your order in respect of the incorrectly priced product as cancelled.\n' +
        '\n' +
        'Beyond The Beach reserve the right to refuse payments in its reasonable discretion.\n' +
        '\n' +
        'If you order products, you agree to pay the full amount payable for such products as indicated during the order process, along with any shipping costs or other charges applicable to that order including any applicable taxes and duties.\n' +
        '\n' +
        'You confirm that the payment card that is being used is yours or that you have been specifically authorized by the owner of the payment card to use it. All payment cardholders are subject to validation checks and authorization by the card issuer. If the issuer of your payment card refuses to authorize payment, we will not be liable for any delay or non-delivery.\n' +
        '\n' +
        'All payment card transactions on the Website are processed using a secure online payment gateway that encrypts your card details in a secure host environment. To help ensure that your shopping experience is safe, simple and reliable, the Website uses Secure Socket Layer (SSL) technology.\n' +
        '\n' +
        'We take reasonable care, in so far as it is in our power to do so, to keep the details of your order and payment secure, but in the absence of negligence on our part we cannot be held liable for any loss you may suffer if a third party procures unauthorized access to any data you provide when accessing or ordering from the Website.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '11. Description of Products:\n' +
        '\n' +
        'The Products depicted in the Website are as seen. The reproduction of colors and styles are as accurate as photographic and image processing will allow. Beyond The Beach does not accept responsibility for slight variances in color and style.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '12. Cancellation, Returns and Defective Products:\n' +
        '\n' +
        'Cancellation\n' +
        'Unless there has been an error on our part, or the Product you purchased is defective, we cannot accept returns on (1) personalized Products (as these cannot be sold to anyone else), (2) cameras or (3) tech Products.\n' +
        '\n' +
        'Returns\n' +
        'If you want to return a Product, contact us, indicating which Product(s) and the number of Products to be returned and your reason for return. If the Product is returnable under these Terms and Conditions, we will arrange for the pickup of such Product(s) after our receipt of your return request.\n' +
        'Returns should be made within 14 days of delivery and should be sent back in their original condition and original packaging provided. Clothing, Swimwear and Caps must be unworn and in perfect condition, with all the labels/tags. Swimming costumes and bikini bottoms should be tried on over underwear. Returns may not be accepted if the protection strip has been removed (swimming wear) and will be returned to you.\n' +
        '\n' +
        'Defective Products\n' +
        'If you return a Product because of an error on our part, or because it is defective, this Product(s) must be returned in the condition in which you received it within 14 days of delivery. We will arrange for the pickup of such Product(s) after our receipt of your return request.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '13. Refunds and Exchanges:\n' +
        '\n' +
        'Exchanges\n' +
        '\n' +
        'Where We agree that the Products be returned, an exchange will be processed by Beyond The Beach following the receipt of the returned Products. A refund will only be offered where it is not possible to replace the Product(s).\n' +
        '\n' +
        ' \n' +
        '\n' +
        'Refunds\n' +
        '\n' +
        'Upon confirming that returned items meet the criteria above and qualify for compensation to the customer, we will refund the value paid by the customer in full, on any payments made via Debit/Credit Card (AED 15.00 will be deducted from the refunded sum, to cover for shipping costs). On orders paid via Cash On Delivery, we will offer a coupon code to the customer, equating to the full value of the purchase, that can be used as credit in our online store, in exchange for other product/s (AED 15.00 will be deducted from the refunded sum, to cover for shipping costs). This coupon code will be valid for period of 15 days only.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '14. Delivery:\n' +
        '\n' +
        'Beyond The Beach will deliver the products ordered by you to the address, which you give for delivery when you make your order. You may specify a delivery address which is different from your invoice address, if, for example, you would like Us to deliver the Products directly to a friend, a relative, or to your place of work. Delivery charges may apply and are as laid out on Website or as indicated during the order process. Delivery will be made as soon as possible and usually within 2 Working Days of our receipt of your payment.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '15. Passing of property and risk:\n' +
        '\n' +
        'Beyond The Beach retains legal ownership of the product(s) until full payment has been made and such payment has been received. Legal ownership of the product(s) will immediately revert to Us, if payment is refunded to you. Risk on the product(s) will pass to you upon delivery.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '16. Governing Law and Jurisdiction:\n' +
        '\n' +
        'These Terms and Conditions shall be exclusively governed by and construed in accordance with the laws of the United Arab Emirates and you irrevocably submit to the exclusive jurisdiction of the courts of the United Arab Emirates.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '17. Contacting Us:\n' +
        '\n' +
        'You can contact Beyond The Beach whether to trace your order or for any other reason by emailing us at contact@beyondthebeach.com In all instances, please be ready to supply relevant information which We will require from you in order to identify your order. You can also contact us directly by telephone on +971 4 289 4858.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '18. Gift Voucher Terms and Conditions:\n' +
        '\n' +
        '• Gift vouchers can only be redeemed against products shown on this Website\n' +
        '• Only gift vouchers stamped with the Beyond The Beach L.L.C company stamp are valid.\n' +
        '• Gift Vouchers cannot be exchanged for cash and are not refundable or transferable.\n' +
        '• Gift Vouchers which are defaced, altered or cancelled will not be accepted.\n' +
        '• Gift vouchers may be exchanged for products of a higher or equal price than the face value on this voucher.\n' +
        '• Gift vouchers are redeemable in the UAE only.\n' +
        '• We reserve the right to change the Terms and Conditions at any time.\n' +
        '• Products on sale are not eligible for coupon codes or promo codes.\n' +
        '\n' +
        ' \n' +
        '\n' +
        '18.a Ramadan Offers Terms and Conditions:\n' +
        '\n' +
        '• Returns/Exchanges will not be accepted on items that are included in a bundle or offer.\n' +
        '\n' +
        '19. Miscellaneous:\n' +
        '\n' +
        'These Terms and Conditions (together with the Privacy Policy) contain all the terms of your agreement with Us relating to your use of this Website. No other written or oral statement (including statements in any brochure or promotional literature published by Us will be incorporated.\n' +
        '\n' +
        'If any of the provision of these Terms and Conditions is held to be illegal or unenforceable, the other terms of these Terms and Conditions shall not be affected and shall remain in full force and effect.\n' +
        '\n' +
        'No waiver by Us shall be construed as a waiver of any rights or remedies, or any subsequent breach of any provision of these Terms and Conditions.\n' +
        'You and Beyond The Beach are independent contractors, and these Terms and Conditions will not, in whole or in part, establish any relationship of partnership, joint venture, employment, franchise or agency between you and Beyond The Beach. Neither party will have the power to bind the other or incur obligations on the other’s behalf without the other’s prior written consent. Neither party is authorized to act as an agent or representative of the other or for or on behalf of the other party in any capacity other than as expressly set out in the Terms and Conditions. Neither party shall advertise, represent or hold itself (or any of its agents) out as so acting or being authorized so to act, or incur any liability or obligation on behalf of, or in the name of, the other party, unless specifically provided for in these Terms and Conditions.\n' +
        'We make no warranty whatsoever for the reliability, stability or any virus-free nature of any software being downloaded from this Website, nor for the availability of the download sites where applicable.\n' +
        '\n' +
        'All software products downloaded (where applicable) from any section of this Website or via a link pointed to by this Website are downloaded, installed, and used totally and entirely at the user’s own risk.\n' +
        '\n' +
        'Your use of this Website, any downloaded material from it and the operation of these Terms and Conditions shall be governed by, construed and interpreted in accordance with the laws of the United Arab Emirates and you agree to submit to the non-exclusive jurisdiction of the United Arab Emirates Courts.',
      buttons: [{
        text: 'Okay'
      }],
    });
    await alert.present();
  }


}
