import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'cs312-team-project';
  numRows = 0;
  numCols = 0;
  numColors = 0;
  colLabels: string[] = [];
  showTables = false;

  formErrors = {
    numRows: '',
    numCols: '',
    numColors: ''
  };

  colorsList = [
    { name: 'Red', value: 'red' },
    { name: 'Orange', value: 'orange'},
    { name: 'Yellow', value: 'yellow'},
    { name: 'Green', value: 'green'},
    { name: 'Teal', value: 'teal'},
    { name: 'Blue', value: 'blue'},
    { name: 'Purple', value: 'purple'},
    { name: 'Gray', value: 'gray'},
    { name: 'Brown', value: 'brown'}, 
    { name: 'Black', value: 'black'} 
  ];

  colorsNotUsed = [{ name: '', value: ''}];

  selectedColors: any[] = [];
  dropdownOpen: boolean[] = [];

  getExcelColumnLabels(count: number): string[] {
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      let label = '';
      let n = i;
      do {
        label = String.fromCharCode(65 + (n % 26)) + label;
        n = Math.floor(n / 26) - 1;
      } while (n >= 0);
      labels.push(label);
    }
    return labels;
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const rowsInput = form.elements.namedItem('numRows') as HTMLInputElement;
    const colsInput = form.elements.namedItem('numCols') as HTMLInputElement;
    const colorsInput = form.elements.namedItem('numColors') as HTMLInputElement;

    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);
    const colors = parseInt(colorsInput.value);

    this.formErrors = {
      numRows: '',
      numCols: '',
      numColors: ''
    };

    let valid = true;

    if (isNaN(rows)) {
      this.formErrors.numRows = 'Rows must be a valid number.';
      valid = false;
    } else if (rows < 1 || rows > 1000) {
      this.formErrors.numRows = 'Rows must be between 1 and 1000.';
      valid = false;
    }

    if (isNaN(cols)) {
      this.formErrors.numCols = 'Columns must be a valid number.';
      valid = false;
    } else if (cols < 1 || cols > 702) {
      this.formErrors.numCols = 'Columns must be between 1 and 702.';
      valid = false;
    }

    if (isNaN(colors)) {
      this.formErrors.numColors = 'Colors must be a valid number.';
      valid = false;
    } else if (colors < 1 || colors > 10) {
      this.formErrors.numColors = 'Colors must be between 1 and 10.';
      valid = false;
    }

    if (!valid) {
      return;
    }

    this.numRows = rows;
    this.numCols = cols;
    this.numColors = colors;
    this.colLabels = this.getExcelColumnLabels(cols);
    this.showTables = true;
    this.selectedColors = [];
    this.colorsNotUsed = [{ name: '', value: ''}]; 

    for (let i = 0; i < 10; i++) {
      if (i < this.numColors) {
        this.selectedColors[i] = this.colorsList[i]; 
        this.dropdownOpen[i] = false;
      }
      else {
        this.colorsNotUsed[i - this.numColors] = this.colorsList[i];
      }
    }
  }

  // Alert on cell click
  onCellClick(col: string, row: number) {
    alert(`${col}${row}`);
  }

  // TODO: Needs refactoring to print correctly
  printPage() {
    window.print();
  }

  selectColor(index: number, color: any) {
    if (this.colorsNotUsed.includes(color)) {
      this.colorsNotUsed[this.colorsNotUsed.indexOf(color)] = this.selectedColors[index];
      this.selectedColors[index] = color;

    }
    this.dropdownOpen[index] = false;
  }

  toggleDropdown(index: number) {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }
}
