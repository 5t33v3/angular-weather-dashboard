import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../weather.model';


@Component({
  selector: 'app-weather-card',
  imports: [CommonModule],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css'
})
export class WeatherCardCmp {
  @Input() weather: WeatherData | null = null;

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}