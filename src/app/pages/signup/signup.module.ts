import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {SignupComponent} from './signup';
import { SignupPageRoutingModule } from './signup-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule
  ],
  declarations: [
    SignupComponent,
  ]
})
export class SignUpModule { }
