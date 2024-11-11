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
  mentorForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.mentorForm = new FormGroup({
      sessionDate: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)])
    });
  }

  // Método para guardar o enviar el formulario
  onSubmit() {
    if (this.mentorForm.valid) {
      // Lógica para guardar los datos
    }
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
