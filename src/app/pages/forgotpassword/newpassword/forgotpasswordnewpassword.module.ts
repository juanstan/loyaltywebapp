import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordNewPasswordPage } from './forgotpasswordnewpassword';
import { ForgotPasswordNewPasswordPageRoutingModule } from './forgotpasswordnewpassword-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotPasswordNewPasswordPageRoutingModule
  ],
  declarations: [
    ForgotPasswordNewPasswordPage,
  ]
})
export class ForgotpasswordNewPasswordModule { }
