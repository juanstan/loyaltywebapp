import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CouponsPage} from './coupons';

const routes: Routes = [
  {
    path: '',
    component: CouponsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
