import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-proyecto.component.html',
  styleUrl: './editar-proyecto.component.css'
})
export class EditarProyectoComponent {
  constructor(
    private firestoreService: FirestoreService,
    private router: Router  
  ) {}
  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
