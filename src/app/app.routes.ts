import { Routes } from '@angular/router';
import { LandingGenialisisComponent } from './components/landing-genialisis/landing-genialisis.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';


export const routes: Routes = [
  {
    path: '',
    component: LandingGenialisisComponent
  },
  {
    path: 'politica-privacidad',
    component: PoliticaPrivacidadComponent
  },
  {
    path: 'terminos-condiciones',
    component: TerminosCondicionesComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];