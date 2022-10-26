import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OffersPage } from './offers';
import { OffersRoutingModule } from './offers-routing.module';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    OffersRoutingModule,
  ],
  declarations: [
    OffersPage,
  ]
})
export class OffersModule { }
