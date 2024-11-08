import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-proyecto.component.html',
  styleUrl: './editar-proyecto.component.css'
})

export class EditarProyectoComponent {
  proyecto: any = null; // Para almacenar la información del proyecto
  proyectos: any[] = []; // Para almacenar todos los proyectos del usuario
  correoUsuario: string | null = null;
  imagePreview: string | ArrayBuffer | null = null; // Para almacenar la vista previa de la imagen
  imageFile: File | null = null; // Para almacenar el archivo de imagen seleccionado
  
  document = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
    fundingGoal: new FormControl('', [Validators.required, this.validatePositiveNumber]),
    category: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required])
  });

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {this.correoUsuario = this.usuarioService.getCorreoUsuario()}

  ngOnInit() {
      this.loadProyectos();
  }

  loadProyectos() {
    if (this.correoUsuario) {
      // Usamos el servicio para obtener los proyectos filtrados por idEncargado
      this.firestoreService.getProyectosByEncargado(this.correoUsuario)
        .subscribe((proyectos: any[]) => {
          this.proyectos = proyectos; // Guardamos los proyectos en la variable 'proyectos'
          if (this.proyectos.length > 0) {
            this.proyecto = this.proyectos[0]; // Por defecto seleccionamos el primer proyecto
          }
        });
    }
  }


  onSelectProyecto(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const proyectoId = selectElement.value;
    const selectedProyecto = this.proyectos.find(p => p.id === proyectoId);
    this.proyecto = selectedProyecto || null;  // Actualizamos el proyecto seleccionado
    this.document.patchValue({
      projectName: this.proyecto?.nombre || '',
      projectDescription: this.proyecto?.descripcion || '',
      fundingGoal: this.proyecto?.objetivoFinanciacion || '',
      category: this.proyecto?.categoria || '',
      dueDate: this.proyecto?.fechaLimite || ''
    });
  }

  updateProyecto() {
    // Se obtiene el valor de cada campo del formulario
    const updatedProjectData = this.document.value;
  
    // Creamos un objeto vacío para los campos que vamos a actualizar
    const updateData: any = {};
  
    // Verificar si cada campo tiene un valor no vacío
    if (updatedProjectData.projectName && updatedProjectData.projectName.trim() !== '') {
      updateData.nombre = updatedProjectData.projectName;
    }
    if (updatedProjectData.projectDescription && updatedProjectData.projectDescription.trim() !== '') {
      updateData.descripcion = updatedProjectData.projectDescription;
    }
    if (updatedProjectData.fundingGoal && updatedProjectData.fundingGoal.toString().trim() !== '') {
      updateData.objetivoFinanciacion = updatedProjectData.fundingGoal;
    }
    if (updatedProjectData.category && updatedProjectData.category.trim() !== '') {
      updateData.categoria = updatedProjectData.category;
    }
    if (updatedProjectData.dueDate && updatedProjectData.dueDate.trim() !== '') {
      updateData.fechaLimite = updatedProjectData.dueDate;
    }

    if (this.imagePreview && this.imagePreview !== '') {
      updateData.imagen = this.imagePreview; // Solo actualizamos el campo de la imagen si no está vacío
    }
  
    // Si hay datos para actualizar (al menos un campo no está vacío)
    if (Object.keys(updateData).length > 0) {
      // Obtener el proyecto por su nombre para actualizarlo
      this.firestoreService.getProjectByName('Proyecto', this.proyecto.nombre)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const docId = doc.id;
            // Realizar la actualización en Firestore
            this.firestoreService.updateDocument('Proyecto', docId, updateData)
              .then(() => {
                
                console.log('Proyecto actualizado correctamente');
                alert("Proyecto actualizado exitosamente.");
                this.router.navigate(['/pantalla-principal']);
              })
              .catch((error) => {
                console.error('Error al actualizar el proyecto:', error);
              });
          });
        });
    } else {
      console.log('No se han realizado cambios en los campos.');
    }
  }
    




  // Método para capturar la imagen
  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Almacena la vista previa en base64
      };
      reader.readAsDataURL(file); // Convierte la imagen a base64
      this.imageFile = file; // Guarda el archivo para su posterior carga
    }
  }

  validatePositiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return { invalidAmount: true };
    }
    return null;
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}

/* Llenado lógica
  loadProyectoDetails(proyecto: any) {
    this.document.setValue({
      projectName: proyecto.nombre,
      projectDescription: proyecto.descripcion,
      fundingGoal: proyecto.objetivoFinanciacion,
      category: proyecto.categoria,
      dueDate: proyecto.fechaLimite,
    });

    if (proyecto.imagen) {
      this.imagePreview = proyecto.imagen; // Asumimos que la imagen es una URL o base64
    }
  }
*/