import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from '../../../providers/account.service';
import {environment} from "../../../../environments/environment";


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

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.loading = false;
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
      this.accountService.checkIfUserExistInProgram().subscribe(data => {
        if (data) {
          this.accountService.sendVerificationCode().subscribe(data => {

          });
        }
      });
    }

    this.loading = true;


  }

}
