import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherCardCmp } from '../weather-card/weather-card';
import { WeatherSearchCmp } from '../weather-search/weather-search';
import { WeatherForecastCmp } from '../weather-forecast/weather-forecast';
import { WeatherData, WeatherForecast } from '../weather.model';
import { Subject,takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather-dashboard',
  imports: [
    CommonModule, 
    WeatherCardCmp, 
    WeatherSearchCmp, 
    WeatherForecastCmp,
  ],
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.css'
})

export class WeatherDashboardCmp implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  currentWeather = signal<WeatherData | null>(null);
  weatherForecast = signal<WeatherForecast[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  favorites = signal<string[]>([]);
  favoriteWeather = signal<WeatherData[]>([]);


  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to loading state and clean up on destroy
    this.weatherService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => this.isLoading.set(loading));

    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites.set(JSON.parse(saved));
      this.refreshFavoriteWeather();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(weather: WeatherData): void {
  const loc = weather.location; // extract location from WeatherData
  const current = this.favorites();

  if (current.includes(loc)) {
    this.favorites.set(current.filter(c => c !== loc));
  } else {
    this.favorites.set([...current, loc]);
  }

  localStorage.setItem('favorites', JSON.stringify(this.favorites()));
  this.refreshFavoriteWeather();
}

  isFavorite(location: string): boolean {
    return this.favorites().includes(location);
  }

   private refreshFavoriteWeather(): void {
    const cities = this.favorites();
    const weatherDataList: WeatherData[] = [];

    this.favoriteWeather.set([]); // clear before refreshing

    cities.forEach(city => {
      this.weatherService.getCurrentWeather(city).subscribe({
        next: (data) => {
          weatherDataList.push(data);
          this.favoriteWeather.set([...weatherDataList]); // update progressively
        },
        error: (err) => {
          console.error(`Failed to refresh weather for ${city}`, err);
        }
      });
    });
  }

  searchWeatherByCity(city: string): void {
    this.clearError();
    
    // Get current weather
    this.weatherService.getCurrentWeather(city).subscribe({
      next: (weather) => {
        this.currentWeather.set(weather);
        this.weatherService.updateWeather(weather);
        
        // Get forecast
        this.weatherService.getForecast(city).subscribe({
          next: (forecast) => {
            this.weatherForecast.set(forecast);
          },
          error: (error) => {
            console.error('Forecast error:', error);
            // Don't show error for forecast failure if weather succeeded
          }
        });
      },
      error: (error) => {
        this.errorMessage.set(`Unable to find weather data for "${city}". Please check the city name and try again.`);
        console.error('Weather error:', error);
      }
    });
  }

  searchWeatherByLocation(coords: {lat: number, lon: number}): void {
    this.clearError();
    
    this.weatherService.getWeatherByCoords(coords.lat, coords.lon).subscribe({
      next: (weather) => {
        this.currentWeather.set(weather);
        this.weatherService.updateWeather(weather);
      },
      error: (error) => {
        this.errorMessage.set('Unable to get weather data for your location. Please try searching for a city instead.');
        console.error('Location weather error:', error);
      }
    });
  }

  clearError(): void {
    this.errorMessage.set('');
  }
}