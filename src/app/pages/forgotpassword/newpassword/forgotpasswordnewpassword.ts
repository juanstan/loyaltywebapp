import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../providers/account.service';
import {FormControlValidators} from '../../../shared/utils/form-validators';
import {StorageService} from '../../../core/services/storage.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'page-forgotpasswordnewpassword',
  templateUrl: 'forgotpasswordnewpassword.html',
  styleUrls: ['./forgotpasswordnewpassword.scss'],
})
export class ForgotPasswordNewPasswordPage  implements OnInit {
  submitted = false;
  supportMessage: string;
  loading: boolean;
  form: FormGroup;
  successMessage: boolean;
  error: string;
  code: string;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code');
    this.submitted = false;
    this.successMessage = false;
    this.loading = false;
    this.error = '';
    this.form = this.formBuilder.group({
        // eslint-disable-next-line max-len
        newpassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
        newpasswordrepeat: ['', Validators.required],
    },
  {
    validator: FormControlValidators.match(
      'newpassword',
      'newpasswordrepeat'
    )});
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

      this.accountService.changePassword(this.form.value.newpassword, this.code, customerId).subscribe(response => {
        if (response.status === 'success'){
          this.successMessage = true;
        } else {
          this.error = 'problem updating your password. Please try again';
          this.loading = false;
        }
      }, () => this.loading = false);
    }

    this.loading = true;
  }

  gotToLogin() {
    this.router.navigate(['/login']);
  }

}
