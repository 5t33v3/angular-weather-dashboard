import { Component, signal } from '@angular/core';
import { WeatherDashboardCmp } from './weather-dashboard/weather-dashboard';


@Component({
  selector: 'app-root',
  imports: [WeatherDashboardCmp],
  template: `<app-weather-dashboard></app-weather-dashboard>`,
  
})
export class AppCmp {
  title = signal('Weather App');
}
