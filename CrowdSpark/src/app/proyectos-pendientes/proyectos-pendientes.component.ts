import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos-pendientes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './proyectos-pendientes.component.html',
  styleUrl: './proyectos-pendientes.component.css'
})
export class ProyectosPendientesComponent {
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
    this.firestoreService.getPendingProjects().subscribe((data: any[]) => {
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
  
  validarProyecto(proyecto: any) {
    this.router.navigate(['/validar-proyecto', proyecto.nombre]);  // Pasar el nombre del proyecto como parámetro
  }

  cambiarPantalla() {
    this.router.navigate(['/pagina-mentor']);
  }
}
