import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css'
})
export class WeatherSearchCmp {
  @Output() citySearch = new EventEmitter<string>();
  @Output() locationSearch = new EventEmitter<{lat: number, lon: number}>();
  
  searchQuery = signal('');

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.citySearch.emit(query);
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationSearch.emit({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search for a city instead.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}