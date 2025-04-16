import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, DataItem } from '../api.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.css']
})
export class ApiTestComponent {
  //Holds array of polymorphic DataItem objects from ApiService returned from PHP backend
  data: DataItem[] = [];

  //Inject the ApiService to make HTTP calls to the backend
  constructor(private apiService: ApiService) { }

  //Calls on getData from ApiService to load in 10 items from DB
  loadData(): void {
    //Asynchronous observer makes call to backend
    this.apiService.getData('default_table', 10).subscribe({
      //If successful
      next: res => {
        //Store returned JSON data array of DataItems into data array
        this.data = res;
        console.log('Loaded data:', res);
      },
      //If error
      error: err => console.error('Error loading data', err)
    });
  }

  //calls on postData from ApiService to insert new relation into DB
  insertRecord(): void {
    //because this is a test, these values are hard-coded. Probably need to get the record to insert from a form on the app in practice.
    const newRecord = {
      column1: 'Example Value 1',
      column2: 'Example Value 2'
    };
    //Asynchronous observer makes call to backend
    this.apiService.postData('default_table', newRecord).subscribe({
      //if successful
      next: res => {
        console.log('Record inserted:', res);
        //call on loadData above to reload the data shown in the app for good user feedback
        this.loadData();
      },
      //if error
      error: err => console.error('Error inserting record', err)
    });
  }
}
