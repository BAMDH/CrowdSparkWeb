import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css'
})
export class CrearProyectoComponent {
  constructor(
    private firestoreService: FirestoreService,
    private router: Router  
  ) {}
  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
