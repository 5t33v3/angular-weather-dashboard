import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { WeatherData, WeatherForecast } from './weather.model';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiKey = environment.weatherApiKey; 
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  private weatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public weather$ = this.weatherSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherData> {
    this.loadingSubject.next(true);
    
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.mapWeatherResponse(response)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => new Error('Failed to fetch weather data'));
      })
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    this.loadingSubject.next(true);
    
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.mapWeatherResponse(response)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => new Error('Failed to fetch weather data'));
      })
    );
  }

  getForecast(city: string): Observable<WeatherForecast[]> {
    const url = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.mapForecastResponse(response)),
      catchError(error => throwError(() => new Error('Failed to fetch forecast data')))
    );
  }

  updateWeather(weatherData: WeatherData): void {
    this.weatherSubject.next(weatherData);
    this.loadingSubject.next(false);
  }

  private mapWeatherResponse(response: any): WeatherData {
    return {
      location: `${response.name}, ${response.sys.country}`,
      temperature: Math.round(response.main.temp),
      description: response.weather[0].description,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      icon: response.weather[0].icon,
      feelsLike: Math.round(response.main.feels_like),
      pressure: response.main.pressure,
      visibility: response.visibility / 1000, // Convert to km
      uvIndex: 0 // Would need separate UV API call
    };
  }

  private mapForecastResponse(response: any): WeatherForecast[] {
    const dailyForecasts: { [key: string]: any } = {};
    
    response.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [item.main.temp],
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      } else {
        dailyForecasts[date].temps.push(item.main.temp);
      }
    });

    return Object.values(dailyForecasts).slice(0, 5).map((day: any) => ({
      date: day.date,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      description: day.description,
      icon: day.icon
    }));
  }
}