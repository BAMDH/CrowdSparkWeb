import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-pantalla-principal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})

export class PantallaPrincipalComponent {
  proyectos: any[] = [];  // Variable para almacenar los proyectos
  selectedFilter: string = 'nombre';  // Opción seleccionada en el comboBox
  isMentor: boolean = false;
  correoUsuario: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {this.correoUsuario = this.usuarioService.getCorreoUsuario()}

  ngOnInit() {
    this.cargarProyectos();  // Cargar proyectos al iniciar el componente
    this.checkMentor();
  }

  cargarProyectos() {
    this.firestoreService.getApprovedProjects().subscribe((data: any[]) => {
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

  checkMentor() {
    this.firestoreService.checkMentor(this.correoUsuario).subscribe((isMentor: boolean) => {
      this.isMentor = isMentor;
    });
  }
  
  verProyecto(proyecto: any) {
    this.router.navigate(['/ver-proyecto', proyecto.nombre]);  // Pasar el nombre del proyecto como parámetro
  }

  crearProyecto() {
    this.router.navigate(['/crear-proyecto']);
  }

  editarProyecto() {
    this.router.navigate(['/editar-proyecto']);
  }

  historial() {
    this.router.navigate(['/historial']);
  }

  editarUsuario() {
    this.router.navigate(['/editar-usuario']);
  }

  sesiones() {
    this.router.navigate(['/sesiones']);
  }

  cerrarSesion() {
    this.router.navigate(['/inicio']);
  }

  // Método para redirigir a la página de mentor
  irAPaginaMentor() {
    this.router.navigate(['/pagina-mentor']);
  }
}
