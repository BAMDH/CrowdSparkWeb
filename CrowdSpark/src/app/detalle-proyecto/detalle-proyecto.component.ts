import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detalle-proyecto.component.html',
  styleUrl: './detalle-proyecto.component.css'
})
export class DetalleProyectoComponent {
  proyecto: any;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el nombre del proyecto de la ruta
    const nombreProyecto = this.route.snapshot.paramMap.get('nombre');
    if (nombreProyecto) {
      this.cargarProyecto(nombreProyecto);  // Cargar el proyecto por nombre
    }
  }

  cargarProyecto(nombre: string) {
    this.firestoreService.getCollectionData('Proyecto').subscribe((data: any[]) => {
      const proyectoEncontrado = data.find(p => p.nombre === nombre);
      if (proyectoEncontrado) {
        this.proyecto = proyectoEncontrado;
      } else {
        console.error('No se encontró el proyecto');
      }
    });
  }

  // Función para navegar de vuelta a la pantalla anterior
  volver() {
    this.router.navigate(['/main-admin']);
  }

}
