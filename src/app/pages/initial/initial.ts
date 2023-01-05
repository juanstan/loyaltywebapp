import {Component, OnInit, ViewChild} from '@angular/core';
import {HistoryService} from '../../providers/history.service';
import {Observable} from 'rxjs/internal/Observable';
import {History} from '../../model/history';
import {User} from '../../model/user';
import {AccountService} from '../../providers/account.service';
import {snapshot} from '../../shared/utils/snapshot.util';
import {ProgramService} from '../../providers/program.service';
import {Program} from '../../model/program';
import {delay, finalize, map, tap} from 'rxjs/operators';
import {Currency} from '../../model/currency';
import { IonInfiniteScroll, AlertController, ToastController } from '@ionic/angular';
import {MessagingService} from '../../providers/messaging.service';
import { IonContent } from '@ionic/angular';

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
  loading: boolean;
  histories: History[];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private historyService: HistoryService,
    private accountService: AccountService,
    private programService: ProgramService,
    private messagingService: MessagingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.histories = [];
    this.user = this.accountService.userValue;
    this.listenForMessages();
  }

  ionViewWillEnter() {
    this.content.scrollToTop(400);
  }

  ngOnInit() {
    this.loaded = false;
    this.loading = true;
    this.histories$ = this.historyService.getHistoriesObservable().pipe(map(histories => {
      this.loaded = false;
      if (histories === null) {
        this.histories = [];
        return this.histories;
      }
      if (histories) {
       this.histories = [...this.histories, ...histories];
       if (histories.length === 0) {
         this.loaded = true;
         this.loading = false;
       }
     }
     return this.histories;
    }), tap((val) => {
      if (val.length > 0) {
        this.loading = false;
      }
    }));
    this.program$ = this.programService.getProgramObservable().pipe(tap(program => {
      this.currencies = program?.currencies;
    }));
  }

  checkCurrency(currencyId) {
    return this.currencies.find(currency => currency.id === currencyId)?.code;
  }

  loadData(event) {
    if (this.loaded) {
      event.target.disabled = true;
      return;
    }
      this.accountService.loadAllData().subscribe(() => {
        event.target.complete();
      });
  }

  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        subHeader: msg.notification.body,
        // message: msg.data.info,
        buttons: [{
          text: 'Okay',
          handler: () => {
            window.location.reload();
          }
        }],
      });
      await alert.present();
    });
  }

  trackById(index: number, item: History) {
    return item.id;
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
