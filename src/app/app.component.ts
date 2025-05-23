import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AuthService } from './views/login/auth.service';

@Component({
  selector: 'app-root',
  imports: [LoginComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
          password: ''
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
    });
  }
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}