import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CouponsPage } from './coupons';
import { CouponsRoutingModule } from './coupons-routing.module';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    CouponsRoutingModule,
  ],
  declarations: [
    CouponsPage,
  ]
})
export class CouponsModule { }
