import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../providers/account.service';


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

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
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
      this.supportMessage = '';
      this.submitted = false;

    }

    this.loading = true;
  }

}
