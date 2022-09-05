import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {

  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    // @ts-ignore
    this._storage.set(key, value);
  }

  public async get(key: string) {
    // @ts-ignore
    return this._storage.get(key);
  }

  public async remove(key: string) {
    // @ts-ignore
    return this._storage.remove(key);
  }

  public async clear() {
    // @ts-ignore
    return this._storage.clear();
  }

  public async keys() {
    // @ts-ignore
    return this._storage.keys();
  }

}
