import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InitialPage } from './initial';
import { InitialRoutingModule } from './initial-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import {WithLoadingPipe} from '../../shared/pipe/loading.pipe';


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        QRCodeModule,
        InitialRoutingModule
    ],
  declarations: [
    InitialPage,
    WithLoadingPipe
  ]
})
export class InitialModule { }
