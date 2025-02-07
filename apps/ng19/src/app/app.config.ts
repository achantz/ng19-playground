import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';

export const appConfig: ApplicationConfig = {
  //providers: [provideZoneChangeDetection({ eventCoalescing: true })],
  providers: [provideExperimentalZonelessChangeDetection()],
};
