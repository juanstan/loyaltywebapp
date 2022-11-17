import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {SignupComponent} from './signup';
import { SignupPageRoutingModule } from './signup-routing.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    IonIntlTelInputModule
  ],
  declarations: [
    SignupComponent,
  ]
})
export class SignUpModule { }
