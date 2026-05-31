import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ConfirmComponent } from './shared/components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ConfirmComponent],
  template: `
    <app-navbar />
    <router-outlet />
    <app-confirm />
  `,
})
export class App {}
