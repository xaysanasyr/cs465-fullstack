import { InjectionToken } from '@angular/core';

// Define a DI token for browser storage
export const BROWSER_STORAGE = new InjectionToken<Storage>(
  'Browser Storage',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);
export class Storage {
}
