import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public submitted = false;

  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // stay on login page
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    const newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // Kick off login; AuthenticationService will save the token if successful.
    this.authenticationService.login(newUser, this.credentials.password);

    // Immediately check; if not yet logged in, re-check after 3 seconds (matches guide).
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']); // go to trip-list (root)
    } else {
      setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}
