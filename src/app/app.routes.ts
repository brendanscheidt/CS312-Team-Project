import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ApiTestComponent } from './api-test/api-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  //Add route for testing API/DB
  { path: 'api', component: ApiTestComponent }
];
