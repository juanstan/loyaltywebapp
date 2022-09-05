import { Observable } from 'rxjs';

/**
 * Get the LATEST emitted value from observable immediately unsubscribe and return primitive/object
 * Helper function to avoid subscription with take(1)
 * e.g. instead of this.store(selector).pipe(take(1)).subscribe(val => this.val = val)
 * we can do: this.val = snapshot(this.store.select(selector))
 * @param {Observable} source - any observable which can emit data
 * @param source
 * @return {String|Number|Boolean|Object}
 */

export function snapshot<T>(source: Observable<T>): T {
    let result: T;

    const subscr = source.subscribe((res: T) => {
        result = res;
    });
    subscr.unsubscribe();
  // @ts-ignore
    return result;
}
