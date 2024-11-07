import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
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
  nuevoProyecto: any;

  document = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
    fundingGoal: new FormControl('', [Validators.required, this.validatePositiveNumber]),
    category: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required])
  });

  constructor(
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.document.valid) {
      this.nuevoProyecto = {
        categoria: this.document.get('category')?.value,
        descripcion: this.document.get('projectDescription')?.value,
        fechaLimite: this.document.get('dueDate')?.value,
        imagen: null,
        monto: 0,
        nombre: this.document.get('projectName')?.value,
        objetivoFinanciacion: this.document.get('fundingGoal')?.value,
        idEncargado: 1,
      };
      this.addProyecto(this.nuevoProyecto);
    } else {
      this.document.markAllAsTouched();  // Marca todos los campos como tocados para activar los errores
      console.log('Formulario inválido');
    }
  }

  validatePositiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return { invalidAmount: true };
    }
    return null;
  }

  addProyecto(nuevoProyecto: any) {
    // Llamamos al servicio para agregar el proyecto
    this.firestoreService.addDocument('Proyecto', nuevoProyecto)
      .then(() => {
        console.log('Proyecto agregado correctamente');
        alert("Proyecto creado exitosamente.");
        this.router.navigate(['/pantalla-principal']);
      })
      .catch((error) => {
        alert("Error al crear el proyecto.");
        console.error('Error al agregar el proyecto:', error);
      });
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
