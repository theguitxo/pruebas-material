import { registerLocaleData } from '@angular/common';
import localeEsEs from '@angular/common/locales/es';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLocaleData(localeEsEs, 'es-ES');

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
