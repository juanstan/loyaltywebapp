import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OffersPage} from './offers';

const routes: Routes = [
  {
    path: '',
    component: OffersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule { }
