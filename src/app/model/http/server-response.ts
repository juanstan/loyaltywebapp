export class ServerResponse<T> {
  data: T;
  error: string[];

  success(): boolean {
    return this.error == null || this.error.length === 0;
  }
}
