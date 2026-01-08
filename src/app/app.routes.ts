import { Routes } from '@angular/router';
import { LandingGenialisisComponent } from './components/landing-genialisis/landing-genialisis.component';


export const routes: Routes = [
  {
    path: '',
    component: LandingGenialisisComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];