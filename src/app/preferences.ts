import { Injectable } from '@angular/core';

export interface UserSettings {
  darkMode: boolean;
  unit: 'C' | 'F';
}

@Injectable({providedIn: 'root'})
export class PreferencesService{
  private readonly STORAGE_KEY = 'userSettings';

  savePreferences(preferences: { darkMode: boolean; unit: 'C'| 'F'}){
    if(typeof window !== 'undefined' && window.localStorage){
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    }
    
  }
  loadPreferences(): { darkMode: boolean; unit: 'C' | 'F' } {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    // Default values
    return { darkMode: false, unit: 'C' };
  }
 
}