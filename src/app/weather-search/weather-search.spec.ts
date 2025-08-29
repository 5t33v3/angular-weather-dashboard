import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSearchCmp } from './weather-search';

describe('WeatherSearch', () => {
  let component: WeatherSearchCmp;
  let fixture: ComponentFixture<WeatherSearchCmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSearchCmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherSearchCmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
