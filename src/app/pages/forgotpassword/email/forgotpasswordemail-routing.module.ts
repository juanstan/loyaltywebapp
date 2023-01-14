import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForgotPasswordEmailPage } from './forgotpasswordemail';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordEmailPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordEmailPageRoutingModule { }
