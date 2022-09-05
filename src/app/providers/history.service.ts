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
import {History} from '../model/history';


@Injectable({ providedIn: 'root' })
export class HistoryService {
  public user: User | undefined;
  public histories: History[] | undefined;
  // @ts-ignore
  public histories$ = new BehaviorSubject<History[]>(null);
  public token: string | undefined;
  echo: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {

    this.histories$.subscribe(histories => {
      this.histories = histories;
    });

  }


  public get allHistories(): History[] | undefined {
    return this.histories;
  }

  public set allHistories(histories) {
    // @ts-ignore
    this.histories$.next(histories);
  }

  public getHistoriesObservable(): Observable<History[]> {
    return this.histories$;
  }

  public getHistory(id: number | undefined): History {
    // @ts-ignore
    return this.histories?.find(history => history.id === id);
  }

  public requestMyHistory(uuid: any): Observable<History[]> {
    return this.http.get<{data: any}>(`${environment.apiUrl}/app/customer/${uuid}`).pipe(
      // @ts-ignore
      map(data => {
        this.histories = data.data?.customer?.histories;
        debugger;
        return this.histories;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }



}
