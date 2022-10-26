import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: 'store',
        children: [
          {
            path: '',
            loadChildren: () => import('../store/store.module').then(m => m.StoreModule)
          }
        ]
      },
      {
        path: 'coupons',
        children: [
          {
            path: '',
            loadChildren: () => import('../coupons/coupons.module').then(m => m.CouponsModule)
          }
        ]
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadChildren: () => import('../offers/offers.module').then(m => m.OffersModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
          }
        ]
      },
      {
        path: 'home',
        loadChildren: () => import('../initial/initial.module').then(m => m.InitialModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

