import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyDpC-_ODPmKOt5tVjCOEQ8e20YG-KtlKTM",
  authDomain: "projeto-integrador-3-da126.firebaseapp.com",
  projectId: "projeto-integrador-3-da126",
  storageBucket: "projeto-integrador-3-da126.firebasestorage.app",
  messagingSenderId: "944717660882",
  appId: "1:944717660882:web:587bda257b52e5c315230b",
  measurementId: "G-FC68702NB5"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ]
};
