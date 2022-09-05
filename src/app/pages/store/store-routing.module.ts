import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StorePage } from './store';

const routes: Routes = [
  {
    path: '',
    component: StorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorePageRoutingModule { }
