import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../weather.model';
import { WeatherService } from '../weather.service';


@Component({
  selector: 'app-weather-card',
  imports: [CommonModule],
  templateUrl: './weather-card.html',
  styleUrls: ['./weather-card.css']
})
export class WeatherCardCmp implements OnChanges{
  @Input() weather: WeatherData | null = null;
  @Input() city!: string;
  @Input() unit: 'C' | 'F' = 'C';
  @Input() darkMode = false;

 displayTemp?: number;
 displayFeelsLike?: number;

  constructor(private weatherService: WeatherService){}

  

  ngOnChanges(changes:SimpleChanges){
    if(changes['weather'] || changes['unit']){
      this.updateTemperature();
    }
  }

  updateTemperature(){
    if(!this.weather) return;
    this.displayTemp = this.unit === 'F'
    ? Math.round((this.weather.temperature * 9)/ 5+ 32)
    : this.weather.temperature;

    this.displayFeelsLike = this.unit == 'F'
    ? Math.round((this.weather.feelsLike * 9)/ 5+ 32)
    : this.weather.feelsLike;
  }
    
  
  
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}