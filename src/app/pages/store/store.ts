import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {StoreService} from '../../providers/store.service';
import {Store} from '../../model/store';
import {Observable} from 'rxjs/internal/Observable';
import {first, map} from 'rxjs/operators';
import * as _ from 'lodash';


@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
  styleUrls: ['./store.scss'],
})
export class StorePage implements OnInit {

  stores$: Observable<[{id: number, name: string, stores: Store[]}]>;
  websites$: Observable<any[]>;
  storesByProgram;
  location: string;

  constructor(
    public router: Router,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.location = 'stores';
    this.stores$ = this.storeService.requestStoresBusinessByProgram();
    this.websites$ = this.storeService.requestWebsitesByProgram();
    this.storeService.requestStoresByProgram().pipe(
      first(),
      map(data => {
        this.storesByProgram =  _.groupBy(data, store => store.business_name);
      })
    ).subscribe();
  }

  getGoogleLink(store) {
    const link = (store.address1 || '') + ' ' + (store.address2 || '') + ' ' + (store.city || '') + ' ' + (store.country || '');
    return encodeURIComponent(link);
  }

  segmentChanged(ev: any) {
    this.location = ev.detail?.value || this.location;
  }


}
