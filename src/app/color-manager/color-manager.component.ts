import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService, Color } from '../api.service';
import { FormsModule }    from '@angular/forms';

enum ColorManager {
  NONE,
  ADD,
  DELETE,
  EDIT
}

@Component({
  selector: 'app-color-manager',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './color-manager.component.html',
  styleUrls: ['./color-manager.component.css']
})
export class ColorManagerComponent {
  //Holds array of polymorphic Color objects from ApiService returned from PHP backend
  data: Color[] = [];
  readonly ColorManager = ColorManager;
  openForm: ColorManager = ColorManager.NONE;
  newColor: Color = { name: '', hex_value: '' };
  selectedDeleteColorName = '';
  selectedColorForEdit: Color | null = null;
  errorMessage = '';
  confirmDelete = false;
  

  //Inject the ApiService to make HTTP calls to the backend
  constructor(private apiService: ApiService) { 
    this.loadData() 
  }

  toggleAddColor(): void { 
    this.errorMessage = '';
    this.newColor = {name: '', hex_value: ''}; 
    this.openForm = ColorManager.ADD 
  }
  toggleDeleteColor(): void {
    this.errorMessage = '';
    this.selectedDeleteColorName = '';
    this.confirmDelete = false;
    this.loadData();
    this.openForm = ColorManager.NONE;

    if (this.data.length <= 2) {
      this.errorMessage = 'Cannot delete. At least two colors required.';
      return;
    }
    this.openForm = ColorManager.DELETE;
  }
  toggleEditColor(): void { 
    this.errorMessage = '';
    this.selectedColorForEdit = null;
    this.loadData();
    this.openForm = ColorManager.EDIT;
  }

  onColorSelect(color: Color) {
    this.errorMessage = '';
    this.selectedColorForEdit = color;

    this.newColor = {
      name: color.name,
      hex_value: color.hex_value
    };
  }

  nextDeleteStep() {
    this.errorMessage = '';
    this.confirmDelete = true;
  }

  //Calls on getData from ApiService to load in 10 items from DB
  loadData(): void {
    //Asynchronous observer makes call to backend
    this.apiService.getData('colors', 10).subscribe({
      //If successful
      next: res => {
        //Store returned JSON data array of Colors into data array
        this.data = res;
        console.log('Loaded data:', res);
        /* this.errorMessage = ''; */
      },
      //If error
      error: err => console.error('Error loading data', err)
    });
  }

  hexValid(hex: string) : boolean {
    const validChars: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'];
    if (hex.length != 7) return false;
    if (hex.charAt(0) != '#') return false;
    for (let i = 1; i < hex.length; i++) {
      if (isNaN(Number(hex.charAt(i)))) {
        if (!validChars.includes(hex.charAt(i))) {
          return false;
        }
      }
    }
    return true;
  }

  //calls on postData from ApiService to insert new relation into DB
  insertRecord(): void {
    //Asynchronous observer makes call to backend
    if (!this.newColor.name) {
      this.errorMessage = 'Must give new color a name!';
      return;
    }
    if (!this.newColor.hex_value) {
      this.errorMessage = 'New color must have a hex value!'
      return;
    }
    if (!this.hexValid(this.newColor.hex_value)) {
      this.errorMessage = 'Hex value must be in the format {#XXXXXX}.'
      return;
    }
    this.apiService.postData('colors', this.newColor).subscribe({
      //if successful
      next: res => {
        console.log('Record inserted:', res);
        this.loadData();
        this.newColor = { name: '', hex_value: '' };
        this.openForm = ColorManager.NONE;
        this.errorMessage = '';
      },
      //if error
      error: err => {
        if (err.status === 409) {
          this.errorMessage = 'That name or hex already exists.';
        } else {
          this.errorMessage = 'Error adding color.';
        }
      }
    });
  }

  deleteRecord(): void {
    this.apiService.deleteData('colors', this.selectedDeleteColorName).subscribe({
      next: res => {
        console.log('Deleted:', res);
        this.loadData();
        this.openForm = ColorManager.NONE;
      },
      error: err => {
        this.errorMessage = 'Error deleting color.';
      }
    });
  }

  updateRecord(): void {
    if (!this.selectedColorForEdit) return;
    if (!this.newColor.name) this.newColor.name = this.selectedColorForEdit.name;
    if (!this.newColor.hex_value) this.newColor.hex_value = this.selectedColorForEdit.hex_value;
    if (!this.hexValid(this.newColor.hex_value)) {
      this.errorMessage = 'Hex value must be in the format {#XXXXXX}.'
      return;
    }
    this.errorMessage = '';
    this.apiService.putData('colors', { old_name: this.selectedColorForEdit.name, ... this.newColor }).subscribe({
      next: res => {
        console.log('Updated', res);
        this.loadData();
        this.openForm = ColorManager.NONE;
        this.selectedColorForEdit = null;
      },
      error: err => {
        if (err.status === 409) {
          this.errorMessage = 'That name or hex already exists.';
        } else {
          this.errorMessage = 'Error updating color.';
        }
      }
    });
  }
}
