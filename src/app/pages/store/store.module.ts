import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StorePage } from './store';
import { StorePageRoutingModule } from './store-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule
  ],
  declarations: [
    StorePage
  ]
})
export class StoreModule { }
