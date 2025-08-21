import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { Router } from '@angular/router'; 
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard implements OnInit {
  @Input('trip') trip: any;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}
  ngOnInit(): void {
    
  }
  public isLoggedIn()
  {
    return this.authenticationService.isLoggedIn();
  }

public editTrip(trip: Trip): void {
  localStorage.removeItem('tripCode');
  localStorage.setItem('tripCode', trip.code);
  this.router.navigate(['edit-trip']);
}
}
