import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  enter() {
    this.auth.login();
    this.router.navigateByUrl('/vehicles');
  }
}
