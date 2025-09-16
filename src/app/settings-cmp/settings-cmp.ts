import { Component,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from "../../../node_modules/@angular/common";
import { PreferencesService,UserSettings } from '../preferences';

@Component({
  selector: 'app-settings-cmp',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule, NgClass],
  templateUrl: './settings-cmp.html',
  styleUrls: ['./settings-cmp.css']
})
export class SettingsCmp {

  @Output() settingsChange = new EventEmitter<{ darkMode: boolean; unit: 'C' | 'F'}>();

  settingsForm = new FormGroup ({
    darkMode : new FormControl(false),
    unit: new FormControl<'C' | 'F'>('C',{ nonNullable: true})
  });

  constructor(private prefs: PreferencesService){
    
    const saved = this.prefs.loadPreferences();
    this.settingsForm.patchValue(saved, { emitEvent: false});

    this.settingsForm.valueChanges.subscribe(values => {
      const settings = values as UserSettings;
      this.prefs.savePreferences(settings);
      this.settingsChange.emit(settings);
    });
  }

  
}
