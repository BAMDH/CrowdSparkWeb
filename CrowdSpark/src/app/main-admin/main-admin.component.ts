import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './main-admin.component.html',
  styleUrl: './main-admin.component.css'
})

export class MainAdminComponent {
  proyectos: any[] = [];  // Variable para almacenar los proyectos
  selectedFilter: string = 'nombre';  // Opción seleccionada en el comboBox

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProyectos();  // Cargar proyectos al iniciar el componente
  }

  cargarProyectos() {
    this.firestoreService.getCollectionData('Proyecto').subscribe((data: any[]) => {
      this.proyectos = data;  // Guardar los datos en la variable proyectos
      this.ordenarProyectos();  // Ordenar los proyectos inicialmente
    });
  }

  // Método para ordenar los proyectos según el filtro seleccionado
  ordenarProyectos() {
    if (this.selectedFilter === 'nombre' || this.selectedFilter === 'categoria') {
      // Ordenar alfabéticamente por nombre o categoría
      this.proyectos.sort((a, b) => {
        const aValue = a[this.selectedFilter].toLowerCase();
        const bValue = b[this.selectedFilter].toLowerCase();
        return aValue.localeCompare(bValue);  // Ordenar alfabéticamente
      });
    } else if (this.selectedFilter === 'objetivoFinanciacion' || this.selectedFilter === 'monto') {
      // Asegurarse de que los valores sean numéricos
      this.proyectos.sort((a, b) => {
        const aValue = Number(a[this.selectedFilter]);
        const bValue = Number(b[this.selectedFilter]);
        return bValue - aValue;  // Ordenar de mayor a menor
      });
    }
  }

  // Método que se llama cuando se selecciona un filtro en el comboBox
  onFilterChange(event: any) {
    this.selectedFilter = event.target.value;  // Obtener la opción seleccionada
    this.ordenarProyectos();  // Reordenar los proyectos según el filtro
  }
  
  detalleProyecto(proyecto: any) {
    this.router.navigate(['/detalle-proyecto', proyecto.nombre]);  // Pasar el nombre del proyecto como parámetro
  }

  verDonaciones() {
    this.router.navigate(['/donaciones-admin']);
  }
  verUsuarios() {
    this.router.navigate(['/usuarios-admin']);
  }
  verStats() {
    this.router.navigate(['/stats-admin']);
  }
  verEvents() {
    this.router.navigate(['/events-admin']);
  }
  cerrarSesion() {
    this.router.navigate(['/inicio']);
  }
}
