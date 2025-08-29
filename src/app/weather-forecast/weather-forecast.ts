import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherForecast } from '../weather.model';


@Component({
  selector: 'app-weather-forecast',
  imports: [CommonModule],
  templateUrl: './weather-forecast.html',
  styleUrl: './weather-forecast.css'
})


export class WeatherForecastCmp {
  @Input() forecast: WeatherForecast[] = [];

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}