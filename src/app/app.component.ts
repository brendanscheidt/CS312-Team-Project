import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'cs312-team-project';
  numRows = 0;
  numCols = 0;
  colLabels: string[] = [];
  showTables = false;

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
    const rows = parseInt((form.elements.namedItem('numRows') as HTMLInputElement).value);
    const cols = parseInt((form.elements.namedItem('numCols') as HTMLInputElement).value);

    if (isNaN(rows) || isNaN(cols) || rows < 1 || rows > 1000 || cols < 1 || cols > 702) {
      alert('Please enter valid values within the ranges.');
      return;
    }

    this.numRows = rows;
    this.numCols = cols;
    this.colLabels = this.getExcelColumnLabels(cols);
    this.showTables = true;
  }

  // Alert on cell click
  onCellClick(col: string, row: number) {
    alert(`${col}${row}`);
  }

  // TODO: Needs refactoring to print correctly
  printPage() {
    window.print();
  }
}
