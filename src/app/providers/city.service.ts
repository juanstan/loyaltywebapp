import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {StorageService} from '../core/services/storage.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {City} from '../model/city';


@Injectable({ providedIn: 'root' })
export class CityService {
  public cities: City[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public get citysValue(): City[] {
    return this.cities;
  }

  public set regionsValue(cities: City[]) {
    this.cities = cities;
  }

  public getCity(id): City {
    return this.cities.find(region => region.id === id);
  }

  public getCitysReq(region_id: number): Observable<City[]> {
    return this.http.get<{places: any}>(`${environment.apiUrl}/citiesbyregion/${region_id}`).pipe(
      map(data => {
        this.cities = data.places.map(region => {
          return {
            id: region.pk,
            name: region.val
          };
        });
        return this.cities;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }

}
