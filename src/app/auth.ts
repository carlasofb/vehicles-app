import { Service, signal } from '@angular/core';

@Service()
export class Auth {
  private readonly _loggedIn = signal(false);
  readonly loggedIn = this._loggedIn.asReadonly();

  login() {
    this._loggedIn.set(true);
  }
  logout() {
    this._loggedIn.set(false);
  }
}
