import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Users, LogOut, Plus, Download, Edit2, Trash2, Search, ArrowUpDown } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ Users, LogOut, Plus, Download, Edit2, Trash2, Search, ArrowUpDown })
    )
  ]
};
