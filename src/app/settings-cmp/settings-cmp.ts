import { Component,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, CommonModule } from "../../../node_modules/@angular/common";
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
    unit: new FormControl<'C' | 'F'>('C')
  });

  constructor(){
    this.settingsForm.valueChanges.subscribe(values => {
      this.settingsChange.emit(values as{ darkMode: boolean; unit: 'C' | 'F'});
    });
  }
}
