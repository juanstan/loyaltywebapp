import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyPage } from './verify';

const routes: Routes = [
  {
    path: '',
    component: VerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyPageRoutingModule { }
