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

  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to loading state and clean up on destroy
    this.weatherService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => this.isLoading.set(loading));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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