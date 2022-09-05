import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AboutModule } from '../about/about.module';
import {AccountModule} from '../account/account.module';

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    TabsPageRoutingModule,
    AccountModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
