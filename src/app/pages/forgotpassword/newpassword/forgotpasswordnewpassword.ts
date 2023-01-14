import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../providers/account.service';
import {FormControlValidators} from "../../../shared/utils/form-validators";


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

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.loading = false;
    this.form = this.formBuilder.group({
        newpassword: ['', Validators.required],
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
      this.supportMessage = '';
      this.submitted = false;

    }

    this.loading = true;
  }

}
