import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherCardCmp } from '../weather-card/weather-card';
import { WeatherSearchCmp } from '../weather-search/weather-search';
import { WeatherForecastCmp } from '../weather-forecast/weather-forecast';
import { WeatherData, WeatherForecast } from '../weather.model';
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

export class WeatherDashboardCmp implements OnInit {
  currentWeather = signal<WeatherData | null>(null);
  weatherForecast = signal<WeatherForecast[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.weatherService.loading$.subscribe(loading => {
      this.isLoading.set(loading);
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