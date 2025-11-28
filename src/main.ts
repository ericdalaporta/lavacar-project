import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

registerLocaleData(ptBr);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
