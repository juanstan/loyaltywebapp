import {Component, OnInit, ViewChild} from '@angular/core';
import {HistoryService} from '../../providers/history.service';
import {Observable} from 'rxjs/internal/Observable';
import {History} from '../../model/history';
import {User} from '../../model/user';
import {AccountService} from '../../providers/account.service';
import {snapshot} from '../../shared/utils/snapshot.util';
import {ProgramService} from '../../providers/program.service';
import {Program} from '../../model/program';
import {delay, finalize, tap} from 'rxjs/operators';
import {Currency} from '../../model/currency';
import { IonInfiniteScroll, AlertController, ToastController } from '@ionic/angular';
import {MessagingService} from '../../providers/messaging.service';

@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
  styleUrls: ['./initial.scss'],
})
export class InitialPage implements OnInit {

  histories$: Observable<History[]>;
  program$: Observable<Program>;
  user: User;
  currencies: Currency[];
  loaded: boolean;
  histories: History[];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private historyService: HistoryService,
    private accountService: AccountService,
    private programService: ProgramService,
    private messagingService: MessagingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.loaded = false;
    this.user = this.accountService.userValue;
    this.listenForMessages();
  }

  ngOnInit() {
    this.histories$ = this.historyService.getHistoriesObservable().pipe(tap(histories => {
      this.histories = histories;
    }));
    this.program$ = this.programService.getProgramObservable().pipe(tap(program => {
      this.currencies = program?.currencies;
    }));

  }

  checkCurrency(currency_id) {
    return this.currencies.find(currency => currency.id === currency_id)?.code;
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.histories.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        subHeader: msg.notification.body,
        // message: msg.data.info,
        buttons: ['OK'],
      });
      await alert.present();

      window.location.reload();
    });
  }

  /*requestPermission() {
    this.messagingService.requestPermission().subscribe(
      async token => {
        const toast = await this.toastCtrl.create({
          message: 'Got your token',
          duration: 2000
        });
        toast.present();
      },
      async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async deleteToken() {
    this.messagingService.deleteToken();
    const toast = await this.toastCtrl.create({
      message: 'Token removed',
      duration: 2000
    });
    toast.present();
  }*/


}
