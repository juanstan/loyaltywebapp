import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { tap } from 'rxjs/operators';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  token = null;

  constructor(
    private afMessaging: AngularFireMessaging,
    private accountService: AccountService
  ) {}

  requestPermission() {
    return this.afMessaging.requestToken.pipe(
      tap(token => {
        console.log('Store token to server: ', token);
        this.accountService.saveNotification(token);
      })
    );
  }

  getMessages() {
    return this.afMessaging.messages;
  }

  deleteToken() {
    if (this.token) {
      this.afMessaging.deleteToken(this.token);
      this.token = null;
    }
  }
}
