import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountPageRoutingModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [
    AccountPage,
  ]
})
export class AccountModule { }
