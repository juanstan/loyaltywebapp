import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {StorageService} from '../core/services/storage.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Program} from '../model/program';
import {History} from '../model/history';
import {Store} from '../model/store';


@Injectable({ providedIn: 'root' })
export class StoreService {
  // @ts-ignore
  public user: User;
  // @ts-ignore
  public stores: Store[];
  // @ts-ignore
  public stores$ = new BehaviorSubject<Store[]>(null);
  // @ts-ignore
  public token: string;
  echo: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.stores$.subscribe(stores => {
      this.stores = stores;
    });

  }

  public getProgramObservable(): Observable<Store[]> {
    return this.stores$;

  }

  public requestStoresBusinessByProgram(): Observable<[{id: number, name: string, stores: Store[]}]> {
    return this.http.get<{places: [{id: number, name: string, stores: Store[]}] }>(`${environment.apiUrl}/brandsbyprogram/${environment.program_id}`).pipe(
      map(data => {
        return data?.places;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }

  public requestStoresByProgram(): Observable<any[]> {
    return this.http.get<{stores: any[]}>(`${environment.apiUrl}/storesbyprogram/${environment.program_id}`).pipe(
      map(data => {
        return data?.stores;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }

  public requestWebsitesByProgram(): Observable<any[]> {
    return this.http.get<{websites: any[]}>(`${environment.apiUrl}/websitesbyprogram/${environment.program_id}`).pipe(
      map(data => {
        return data?.websites;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }



}
