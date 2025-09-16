import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherForecast } from '../weather.model';


@Component({
  selector: 'app-weather-forecast',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './weather-forecast.html',
  styleUrls: ['./weather-forecast.css']
})


export class WeatherForecastCmp {
  @Input() forecast: WeatherForecast[] = [];
  @Input() unit:'C' | 'F' = 'C';
  @Input() darkMode = false;

  convertedForecast: WeatherForecast[] = [];

  ngOnChanges(changes: SimpleChanges){
    if(changes['forecast'] || changes['unit']){
      this.convertForecast();
    }
  }

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
  convertForecast(){
    this.convertedForecast = this.forecast.map(day => ({
      ...day,
      high: this.unit ==='F' ? Math.round((day.high * 9)/5 +32) : day.high,
      low: this.unit === "F" ? Math.round((day.low * 9)/5 +32) : day.low
    }));

  }
}
