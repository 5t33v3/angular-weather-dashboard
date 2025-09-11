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
  standalone : true,
  imports: [
    CommonModule, 
    WeatherCardCmp, 
    WeatherSearchCmp, 
    WeatherForecastCmp,
  ],
  templateUrl: './weather-dashboard.html',
  styleUrls: ['./weather-dashboard.css']
})

export class WeatherDashboardCmp implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  currentWeather = signal<WeatherData | null>(null);
  weatherForecast = signal<WeatherForecast[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  hasSearched = signal<boolean>(false);
  favoritesLoading = signal<boolean>(false);
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
    this.favoriteWeather.set(this.favoriteWeather().filter(f => f.location !== loc));
  } else {
    this.favorites.set([...current, loc]);
    this.favoriteWeather.set([...this.favoriteWeather(), weather])
  }

  localStorage.setItem('favorites', JSON.stringify(this.favorites()));
  
}

  

 private refreshFavoriteWeather(): void {
  const cities = this.favorites();

  if (cities.length === 0) {
    this.favoriteWeather.set([]);
    this.favoritesLoading.set(false);
    return;
  }

  this.favoritesLoading.set(true);
  const weatherDataList: WeatherData[] = [];

  cities.forEach(city => {
    // Skip already loaded favoriteWeather
    if (this.favoriteWeather().some(f => f.location === city)) {
      weatherDataList.push(this.favoriteWeather().find(f => f.location === city)!);
      if (weatherDataList.length === cities.length) {
        this.favoriteWeather.set([...weatherDataList]);
        this.favoritesLoading.set(false);
      }
      return;
    }

    this.weatherService.getCurrentWeather(city).subscribe({
      next: (data) => {
        weatherDataList.push(data);
        if (weatherDataList.length === cities.length) {
          this.favoriteWeather.set([...weatherDataList]);
          this.favoritesLoading.set(false);
        }
      },
      error: (err) => {
        console.error(`Failed to refresh weather for ${city}`, err);
        if (weatherDataList.length + 1 === cities.length) {
          this.favoriteWeather.set([...weatherDataList]);
          this.favoritesLoading.set(false);
        }
      }
    });
  });
}

  searchWeatherByCity(city: string): void {
    this.hasSearched.set(true);
    this.clearError();
    
    // Get current weather
    this.isLoading.set(true);
    this.weatherService.getCurrentWeather(city).subscribe({
      next: (weather) => {
        this.currentWeather.set(weather);
        this.weatherService.updateWeather(weather);
        this.isLoading.set(false);
        
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
        this.isLoading.set(false);
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