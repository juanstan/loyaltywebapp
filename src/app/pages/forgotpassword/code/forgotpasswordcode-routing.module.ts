import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordCodePage } from './forgotpasswordcode';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordCodePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordCodePageRoutingModule { }
