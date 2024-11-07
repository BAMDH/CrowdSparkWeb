import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pantalla-principal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pantalla-principal.component.html',
  styleUrl: './pantalla-principal.component.css'
})

export class PantallaPrincipalComponent {
  
  
  constructor(
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  crearProyecto() {
    this.router.navigate(['/crear-proyecto']);
  }
  editarProyecto() {
    this.router.navigate(['/editar-proyecto']);
  }
  historial() {
    this.router.navigate(['/registro']);
  }
  editarUsuario() {
    this.router.navigate(['/editar-usuario']);
  }
  cerrarSesion() {
    this.router.navigate(['/inicio']);
  }
}
