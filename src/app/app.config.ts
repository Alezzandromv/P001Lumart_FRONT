import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './pipe/token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Ruta del interceptor


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withInterceptors([TokenInterceptor])), provideAnimationsAsync()
  ]
};
