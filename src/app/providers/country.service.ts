import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {StorageService} from '../core/services/storage.service';
import {Observable} from 'rxjs';
import {Country} from '../model/country';
import {catchError, map} from 'rxjs/operators';
import {EMPTY} from 'rxjs/internal/observable/empty';


@Injectable({ providedIn: 'root' })
export class CountryService {
  // @ts-ignore
  public countries: Country[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public get countriesValue(): Country[] {
    return this.countries;
  }

  public set countriesValue(countries: Country[]) {
    this.countries = countries;
  }

  public getCountry(id: number | undefined): Country {
    // @ts-ignore
    return this.countries.find(country => country.id === id);
  }

  public getCountriesReq(): Observable<Country[]> {
    return this.http.get<{countries: Country[]}>(`${environment.apiUrl}/countries`).pipe(
      map(data => {
        this.countries = data.countries;
        return this.countries;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }

}
