import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InitialPage} from './initial';

const routes: Routes = [
  {
    path: '',
    component: InitialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialRoutingModule { }
