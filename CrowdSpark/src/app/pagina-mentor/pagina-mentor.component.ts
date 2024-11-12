import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-pagina-mentor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Asegúrate de importar ReactiveFormsModule
  templateUrl: './pagina-mentor.component.html',
  styleUrls: ['./pagina-mentor.component.css']
})
export class PaginaMentorComponent {
  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
  agendarSesion() {
    this.router.navigate(['/agendar-sesion']);
  }
  proyectosPendientes() {
    this.router.navigate(['/proyectos-pendientes']);
  }
  solicitudesMentoria() {
    this.router.navigate(['/solicitudes-mentoria']);
  }
}
