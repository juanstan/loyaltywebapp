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


@Injectable({ providedIn: 'root' })
export class ProgramService {
  public user: User | undefined;
  public program: Program | undefined;
  // @ts-ignore
  public program$ = new BehaviorSubject<Program>(null);
  public token: string | undefined;
  echo: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {

    this.program$.subscribe(program => {
      this.program = program;
    });

  }

  public getProgramObservable(): Observable<Program> {
    return this.program$;
  }

  public requestProgram(name: any): Observable<Program> {
    return this.http.get<{data: any}>(`${environment.apiUrl}/app/getprogram/${name}`).pipe(
      // @ts-ignore
      map(data => {
        // @ts-ignore
        this.program.id = data.data?.programID;
        return this.program;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }



}
