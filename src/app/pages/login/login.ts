import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../providers/account.service';
import { first } from 'rxjs/operators';
import {AlertService} from '../../shared/services/alert.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {MessagingService} from '../../providers/messaging.service';


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
    private loadingCtrl: LoadingController,
    private messagingService: MessagingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
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
            if (!login.user.email_verified_at) {
              this.error = 'Customer no verified';
              return;
            }
            this.getPushToken();
            this.router.navigateByUrl('/').then(() => loading.dismiss());
          });
        },
        error: response => {
          loading.dismiss();
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


  getPushToken() {
    this.messagingService.requestPermission().subscribe();/*.subscribe(
      async token => {
        const toast = await this.toastCtrl.create({
          message: 'Got your token',
          duration: 2000
        });
        toast.present();
      },
      async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });

        await alert.present();
      }
    )*/;
  }

}
