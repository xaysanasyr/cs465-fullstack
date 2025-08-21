import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({ providedIn: 'root' })
export class TripData {
  // Base URL to our backend API.
  // Keeping this centralized means if your API host or port changes,
  // you only need to update it in one place.
  private readonly baseUrl = 'http://localhost:3000/api';

  // Trips endpoint (a convenience so we don't repeat the string everywhere).
  private readonly tripsUrl = `${this.baseUrl}/trips`;

  constructor(
    private http: HttpClient,
    // Injected Storage provider lets us persist JWTs in localStorage
    // but still keeps the code testable/more flexible than hard-coding localStorage.
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // ---------------- AUTH METHODS ----------------

  // Call to /login endpoint, expects { token: string } in response.
  // Use this in AuthenticationService.login().
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to /register endpoint, also returns { token: string }.
  // This way new users are logged in immediately after registering.
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Shared helper for login/register to avoid code duplication.
  // The backend expects: { name, email, password }.
  // NOTE: For login, "name" is ignored, but sending it causes no issues.
  private handleAuthAPICall(
    endpoint: 'login' | 'register',
    user: User,
    passwd: string
  ): Observable<AuthResponse> {
    const body = {
      name: user.name,   // only required for register, harmless for login
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, body);
  }

  // ---------------- TRIP METHODS ----------------

  // Public trip listing, no JWT required.
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // Get one trip by code, no JWT required (unless you lock it down later).
  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.tripsUrl}/${tripCode}`);
  }

  // Create new trip (protected).
  // Requires Authorization header -> token pulled from localStorage.
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, formData, this.authHeaders());
  }

  // Update existing trip (protected).
  // Also uses Authorization header with JWT.
  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(
      `${this.tripsUrl}/${formData.code}`,
      formData,
      this.authHeaders()
    );
  }

  // ---------------- HELPER ----------------

  // Helper to build Authorization headers with JWT if available.
  // This keeps the repeated header setup DRY and ensures
  // every protected request automatically carries the token.
  private authHeaders(): { headers: HttpHeaders } {
    const token = this.storage.getItem('travlr-token') || '';
    return {
      headers: new HttpHeaders(
        token ? { Authorization: `Bearer ${token}` } : {}
      )
    };
    // TIP: If your backend requires explicit Content-Type:
    // return {
    //   headers: new HttpHeaders({
    //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
    //     'Content-Type': 'application/json'
    //   })
    // };
  }
}
