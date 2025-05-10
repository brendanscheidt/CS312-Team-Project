import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Color } from '../api.service';

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
  totalColors = 0;
  colLabels: string[] = [];
  showTables = false;
  isPrintView= false;

  formErrors = {
    numRows: '',
    numCols: '',
    numColors: ''
  };
  
  colorsList: Color[] = [];
  cellsList: string[][] = [];
  
  colorsNotUsed = [{name: '', hex_value: ''}];
  
  selectedColors: Color[] = [];
  dropdownOpen: boolean[] = [];
  
  activeColor: Color | null = this.selectedColors[0];
  cellColors: string[][] = [];

  constructor(private apiService: ApiService) {
    this.loadData();
  }

  loadData(): void {
    //Asynchronous observer makes call to backend
    this.apiService.getData('colors').subscribe({
      //If successful
      next: res => {
        //Store returned JSON data array of Colors into data array
        this.colorsList = res;
        this.totalColors = res.length;
        console.log('Loaded data:', res);
        /* this.errorMessage = ''; */
      },
      //If error
      error: err => console.error('Error loading data', err)
    });
  }

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
    } else if (colors < 1 || colors > this.totalColors) {
      this.formErrors.numColors = 'Colors must be between 1 and ' + this.totalColors;
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
    this.colorsNotUsed = [{ name: '', hex_value: ''}]; 

    for (let i = 0; i < this.totalColors; i++) {
      if (i < this.numColors) {
        this.selectedColors[i] = this.colorsList[i]; 
        this.dropdownOpen[i] = false;
      }
      else {
        this.colorsNotUsed[i - this.numColors] = this.colorsList[i];
      }
    }

    this.cellColors = 
      Array.from({ length: this.numRows }, () =>
      Array.from({ length: this.colLabels.length }, () => "#ffffff")
    );
    this.cellsList = 
      Array.from({ length: this.numColors }, () =>
      Array.from({ length: 0 }, () => "")
    );
    this.activeColor = this.selectedColors[0];
    console.log("colors not used: ", this.colorsNotUsed);
    console.log("cell colors: ", this.cellColors);
  }

  onRadioChange(event: Event, rowColor: Color): void {
    this.activeColor = rowColor;
    console.log("selected color: ", rowColor);
  }

  onCellClick( i: number, j: number) {
    if(!this.isPrintView){
      this.cellColors[i][j] = this.activeColor?.hex_value || "#ffffff";
    }
    const coord = `${this.colLabels[j]}${i + 1}`;
    if (this.activeColor && !this.cellsList[this.colorsList.indexOf(this.activeColor)].includes(coord)) {
      for (let i = 0; i < this.cellsList.length; i++) {
        this.cellsList[i] = this.cellsList[i].filter(cell => cell != coord);
      }
      this.cellsList[this.colorsList.indexOf(this.activeColor)].push(coord);
      this.cellsList[this.colorsList.indexOf(this.activeColor)].sort();
    }
  }

  // TODO: Needs refactoring to print correctly
  printPage() {
    this.isPrintView = true;
    setTimeout(() =>{
      window.print();
      setTimeout(() =>{
        this.isPrintView = false;
      }, 1000)
    }, 50);
  }

  selectColor(index: number, color: Color) {
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
          if (this.cellColors[i][j] == this.selectedColors[index].hex_value){
            this.cellColors[i][j] = color.hex_value;
          }
      }
    }
    this.colorsNotUsed[this.colorsNotUsed.indexOf(color)] = this.selectedColors[index];
    this.selectedColors[index] = color;
    this.dropdownOpen[index] = false;
  }

  getColorUsageSummary(): string[] {
    const usage: { [hex: string]: string[] } = {};
  
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        const color = this.cellColors[i][j];
        if (!usage[color]) usage[color] = [];
        const coord = `${this.colLabels[j]}${i + 1}`;
        usage[color].push(coord);
      }
    }
  
    return this.selectedColors.map(color => {
      const coords = usage[color.hex_value] || [];
      coords.sort();
      return `${color.name} (${color.hex_value}): ${coords.join(', ')}`;
    });
  }
  

  toggleDropdown(index: number) {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }
}
