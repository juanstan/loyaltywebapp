import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../providers/account.service';
import {Router} from '@angular/router';
import {StorageService} from "../../../core/services/storage.service";


@Component({
  selector: 'page-forgotpasswordemail',
  templateUrl: 'forgotpasswordemail.html',
  styleUrls: ['./forgotpasswordemail.scss'],
})
export class ForgotPasswordEmailPage  implements OnInit {
  submitted = false;
  supportMessage: string;
  loading: boolean;
  form: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.loading = false;
    this.error = '';
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }

  get f() {
    return this.form.controls;
  }


  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.valid) {
      this.supportMessage = '';
      this.submitted = false;
      this.accountService.checkIfUserExistInProgram(this.form.value.email).subscribe(response => {
        if (response) {
          this.accountService.sendVerificationCode(response.customers).subscribe(data => {
            if (data.customer) {
              this.router.navigate(['/forgotpassword/code']);
              this.storageService.set('tmpUserId', data.customer.id);
            } else {
              this.error = 'User not found';
              this.loading = false;
            }
          }, () => this.loading = false);
        } else {
          this.error = 'User not found';
          this.loading = false;
        }
      }, () => this.loading = false);
    }

    this.loading = true;

  }

}
