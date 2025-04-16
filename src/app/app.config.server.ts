import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    //Provide server-side renderer with HttpClient with interceptors from DI and uses the fetch API
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
