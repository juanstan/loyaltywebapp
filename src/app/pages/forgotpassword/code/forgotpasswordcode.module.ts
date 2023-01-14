import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordCodePage } from './forgotpasswordcode';
import { ForgotPasswordCodePageRoutingModule } from './forgotpasswordcode-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotPasswordCodePageRoutingModule
  ],
  declarations: [
    ForgotPasswordCodePage,
  ]
})
export class ForgotPasswordCodeModule { }
