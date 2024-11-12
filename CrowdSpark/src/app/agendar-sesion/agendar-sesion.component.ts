import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-agendar-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './agendar-sesion.component.html',
  styleUrl: './agendar-sesion.component.css'
})
export class AgendarSesionComponent {
  agendarForm: FormGroup;
  projects: string[] = ['Proyecto 1', 'proyecto 2', 'Proyecto 3', 'Proyecto 4'];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.agendarForm = new FormGroup({
      sessionDate: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.agendarForm = this.fb.group({
      project: [''],
      sessionDate: [''],
      sessionTime: [''],
      price: ['']
    });
  }
  // Método para guardar o enviar el formulario
  onSubmit() {
    if (this.agendarForm.valid) {
      // Lógica para guardar los datos
    }
  }

  cambiarPantalla() {
    this.router.navigate(['/pagina-mentor']);
  }

}
