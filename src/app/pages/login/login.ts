import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../providers/account.service';
import { first } from 'rxjs/operators';
import {AlertService} from '../../shared/services/alert.service';
import {LoadingController} from '@ionic/angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (this.accountService.tokenValue) {
      this.router.navigateByUrl('/app/tabs/map');
      return;
    }
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  keypress(event) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }

  async onSubmit() {
    this.submitted = true;
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'circles'
    });
    loading.present();
    this.error = '';

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.accountService.login(this.f.username.value, this.f.password.value).pipe(first())
      .subscribe({
        next: async () => {
          await this.accountService.loadAllData().subscribe((login) => {
            loading.dismiss();
            if (!login.user.email_verified_at) {
              this.error = 'Customer no verified';
              return;
            }
            this.router.navigateByUrl('/');
          });
        },
        error: response => {
          this.error = 'Username or Password incorrect';
          for (const key in response.error) {
           response.error[key]?.map(item => {
             this.alertService.error(item);
           });
          }
          this.loading = false;
        }
      });

  }

  onSignup() {
    this.router.navigateByUrl('/signup');

  }

}
