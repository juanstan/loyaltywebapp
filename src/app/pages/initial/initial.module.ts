import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InitialPage } from './initial';
import { InitialRoutingModule } from './initial-routing.module';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    InitialRoutingModule,
  ],
  declarations: [
    InitialPage,
  ]
})
export class InitialModule { }
