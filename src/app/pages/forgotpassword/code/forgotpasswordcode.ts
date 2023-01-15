import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../providers/account.service';
import {StorageService} from '../../../core/services/storage.service';
import {Router} from '@angular/router';


@Component({
  selector: 'page-forgotpasswordcode',
  templateUrl: 'forgotpasswordcode.html',
  styleUrls: ['./forgotpasswordcode.scss'],
})
export class ForgotPasswordCodePage  implements OnInit {
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
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
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
      const customerId = await this.storageService.get('tmpUserId');
      this.supportMessage = '';
      this.submitted = false;
      this.accountService.verifyCodeForgotPassword(this.form.value.code, customerId).subscribe(response => {
        if (response){
          this.router.navigate(['/forgotpassword/newpassword', {code: response.code}]);
        } else {
          this.error = 'code does not match';
          this.loading = false;
        }
      }, () => this.loading = false);
    }

    this.loading = true;
  }

}
