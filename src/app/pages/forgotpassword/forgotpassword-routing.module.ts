import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    children: [
      {
        path: '',
        redirectTo: 'email',
        pathMatch: 'full'
      },
      {
        path: 'code',
        children: [
          {
            path: '',
            loadChildren: () => import('./code/forgotpasswordcode.module').then(m => m.ForgotPasswordCodeModule)
          }
        ]
      },
      {
        path: 'email',
        children: [
          {
            path: '',
            loadChildren: () => import('./email/forgotpasswordemail.module').then(m => m.ForgotPasswordEmailModule)
          }
        ]
      },
      {
        path: 'newpassword',
        children: [
          {
            path: '',
            loadChildren: () => import('./newpassword/forgotpasswordnewpassword.module').then(m => m.ForgotpasswordNewPasswordModule)
          }
        ]
      },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordPageRoutingModule { }
