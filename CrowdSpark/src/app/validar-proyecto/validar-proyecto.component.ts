import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validar-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './validar-proyecto.component.html',
  styleUrl: './validar-proyecto.component.css'
})
export class ValidarProyectoComponent {
  proyecto: any;

  checklist = {
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false
  };

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

  cambiarPantalla() {
    this.router.navigate(['/proyectos-pendientes']);  
  }

  validar() {
    if (this.isChecklistValid()) {
      this.firestoreService.approveProject(this.proyecto.nombre).subscribe({
        next: () => {
          alert(`¡Proyecto ${this.proyecto.nombre} aprobado!`);
          this.cambiarPantalla();
        },
        error: (error) => {
          console.error('Error approving project:', error);
          alert('Hubo un error al aprobar el proyecto.');
        }
      });
    } else {
      alert('Proyecto no aprobado.');
      this.cambiarPantalla();
    }
  }

  isChecklistValid(): boolean {
    const selectedItems = Object.values(this.checklist).filter(value => value).length;
    return selectedItems >= 3;
  }
}
