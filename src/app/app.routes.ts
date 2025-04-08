import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { TesteComponent } from './components/teste/teste.component';
import { MapComponent } from './views/maps/map.component';

export const routes: Routes = [
    {
      path: "",
      component: HomeComponent
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "map",
      component: MapComponent
    },
];
