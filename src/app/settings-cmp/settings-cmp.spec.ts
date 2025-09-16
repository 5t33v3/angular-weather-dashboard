import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCmp } from './settings-cmp';

describe('SettingsCmp', () => {
  let component: SettingsCmp;
  let fixture: ComponentFixture<SettingsCmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsCmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsCmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
