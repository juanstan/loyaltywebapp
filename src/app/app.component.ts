import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import {MenuController, Platform, ToastController} from '@ionic/angular';
import { UserData } from './providers/user-data';
import {AccountService} from './providers/account.service';
import {StorageService} from './core/services/storage.service';
import * as moment from 'moment';
import {Observable} from "rxjs";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Home',
      url: '/app/tabs/home',
      icon: 'home'
    },
    {
      title: 'Stores',
      url: '/app/tabs/store',
      icon: 'storefront'
    },
    {
      title: 'About Yalla Rewards',
      url: '/app/tabs/about',
      icon: 'information-circle'
    },
    {
      title: 'My Profile',
      url: '/app/tabs/account',
      icon: 'person'
    },
  ];
  loggedIn$ = new BehaviorSubject<boolean>(false);
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storageService: StorageService,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private accountService: AccountService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.checkLoginStatus().then(() => this.loggedIn$.next(true));

  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.storageService.init();
      await this.accountService.init();
    });
  }

  async checkLoginStatus() {
    await this.storageService.init();
    await this.accountService.init();

    if (!this.accountService.userValue || !this.checkIfSystemHasToLogoutUser()) {
      return this.router.navigateByUrl('/login');
    }

    return await this.accountService.loadAllData().subscribe();

  }


  checkIfSystemHasToLogoutUser(): boolean {
    // @ts-ignore
    const lastLogin = this.accountService?.loginObj?.last_login;
    if (lastLogin && moment().isSameOrAfter(moment(lastLogin).add(4, 'hours'))) {
      this.accountService.logout();
      return false;
    }
    return true;
  }


  checkLogout(title: string) {
    if (title === 'Logout') {
      this.accountService.logout();
    }
  }

  logout() {
    this.accountService.logout();
  }


}
