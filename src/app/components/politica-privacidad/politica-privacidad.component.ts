import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politica-privacidad.component.html',
  styleUrl: './politica-privacidad.component.scss'
})
export class PoliticaPrivacidadComponent {

  emailContacto = 'contacto@genialisis.com';
  telefonoContacto = '+57 311 8181816';

  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}