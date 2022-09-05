import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyPage } from './verify';
import { VerifyPageRoutingModule } from './verify-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyPageRoutingModule
  ],
  declarations: [
    VerifyPage,
  ]
})
export class VerifyModule { }
