import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    //Provide server-side renderer with HttpClient with interceptors from DI and uses the fetch API
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ]
}).catch(err => console.error(err));
