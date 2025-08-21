import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data'; 


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) {}

  authResp: AuthResponse = new AuthResponse();

  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false; // malformed/expired token
    }
  }

  public getCurrentUser(): User {
    const token = this.getToken();
    if (!token) return { email: '', name: '' } as User;
    try {
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    } catch {
      return { email: '', name: '' } as User;
    }
  }

  public login(user: User, passwd: string): void {
    this.tripData.login(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value?.token) {
          this.authResp = value;
          this.saveToken(value.token);
        }
      },
      error: (err) => console.error('Login error:', err)
    });
  }

  public register(user: User, passwd: string): void {
    this.tripData.register(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value?.token) {
          this.authResp = value;
          this.saveToken(value.token);
        }
      },
      error: (err) => console.error('Register error:', err)
    });
  }
}
