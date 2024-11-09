import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  
  donar(proyecto: any) {
    console.log(`Donación iniciada para el proyecto: ${proyecto.nombre}`);
    // Lógica para manejar la donación, como abrir un formulario modal,
    // actualizar la recaudación, o navegar a otra pantalla
    // this.router.navigate(['/donar', proyecto.id]); // Ejemplo de navegación a página de donación
  }

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
