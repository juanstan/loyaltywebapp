import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {StorageService} from '../core/services/storage.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {Region} from '../model/region';


@Injectable({ providedIn: 'root' })
export class RegionService {
  public regions: Region[] | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public get regionsValue(): Region[] {
    // @ts-ignore
    return this.regions;
  }

  public set regionsValue(regions: Region[]) {
    this.regions = regions;
  }

  public getRegion(id: number | undefined): Region {
    // @ts-ignore
    return this.regions.find(region => region.id === id);
  }

  public getRegionsReq(country_id: number): Observable<Region[]> {
    return this.http.get<{places: any}>(`${environment.apiUrl}/regionsbycountry/${country_id}`).pipe(
      // @ts-ignore
      map(data => {
        this.regions = data.places.map((region: { pk: any; val: any; }) => {
          return {
            id: region.pk,
            name: region.val
          };
        });
        return this.regions;
      }),
      catchError((err, caught) => {
        console.log(err);
        return EMPTY;
      })
    );
  }

}
