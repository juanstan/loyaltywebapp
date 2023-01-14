import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordEmailPage } from './forgotpasswordemail';
import { ForgotPasswordEmailPageRoutingModule } from './forgotpasswordemail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotPasswordEmailPageRoutingModule
  ],
  declarations: [
    ForgotPasswordEmailPage,
  ]
})
export class ForgotPasswordEmailModule { }
