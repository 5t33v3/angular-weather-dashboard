import { Component, EventEmitter, Output, signal , OnInit,OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-search.html',
  styleUrls: ['./weather-search.css']
})
export class WeatherSearchCmp implements OnInit, OnDestroy {

  @Output() citySearch = new EventEmitter<string>();
  @Output() locationSearch = new EventEmitter<{lat: number, lon: number}>();
  
  searchQuery = signal('');
  suggestions = signal<string[]>([]);
  recentSearches = signal<string[]>([]);
  isFocused = signal(false);

  private searchInput$ = new Subject<string>();
  private subscription = new Subscription();

  constructor(private weatherService: WeatherService){}

  ngOnInit(): void {
      const sub = this.searchInput$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(query => query.length > 1),
        switchMap(query => this.weatherService.getCitySuggestions(query))
      ).subscribe(cities => this.suggestions.set(cities));

      this.subscription.add(sub);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  onInputChange(query: string): void{
    this.searchQuery.set(query);
    this.searchInput$.next(query);
    if(!query.trim()){
      this.suggestions.set([]);
      this.recentSearches.set(this.weatherService.getRecentSearches());
    }

    
  }

  onSelectSuggestion(city: string): void {
    this.searchQuery.set(city);
    this.suggestions.set([]);
    this._saveAndEmit(city);
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this._saveAndEmit(query);
    }
  }

  onFocus(){
    this.isFocused.set(true);
  }

  onBlur(){
    setTimeout(() => this.isFocused.set(false), 200);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationSearch.emit({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search for a city instead.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  private _saveAndEmit(city: string){
    this.citySearch.emit(city);
    this.weatherService.addRecentSearch(city);
    this.recentSearches.set(this.weatherService.getRecentSearches());
  }
}