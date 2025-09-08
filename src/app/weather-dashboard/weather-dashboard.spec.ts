import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDashboardCmp } from './weather-dashboard';

describe('WeatherDashboard', () => {
  let component: WeatherDashboardCmp;
  let fixture: ComponentFixture<WeatherDashboardCmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherDashboardCmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherDashboardCmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
