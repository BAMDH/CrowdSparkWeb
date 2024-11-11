  import { Component } from '@angular/core';
  import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
  import { EmailService } from '../email.service';
  import { FirestoreService } from '../firestore.service';
  import { Router } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { UsuarioService } from '../services/usuario.service';
  import { firstValueFrom } from 'rxjs';
  @Component({
    selector: 'app-editar-proyecto',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './editar-proyecto.component.html',
    styleUrl: './editar-proyecto.component.css'
  })

  export class EditarProyectoComponent {
    proyectos: string[] = []; // Array para almacenar los nombres de los proyectos
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
    ) {
      this.correoUsuario = this.usuarioService.getCorreoUsuario(),
      this.cargarProyectos();
    }

    cargarProyectos() {
      this.correoUsuario = this.usuarioService.getCorreoUsuario();
      console.log(this.usuarioService.getCorreoUsuario());
      this.firestoreService.getCollectionData('Proyecto').subscribe((data: any[]) => {
        // Filtrar los proyectos cuyo 'idEncargado' coincida con 'correoUsuario'
        const proyectosFiltrados = data.filter((proyecto: any) => proyecto.idEncargado === this.correoUsuario);
    
        // Extraer solo los nombres de los proyectos
        this.proyectos = proyectosFiltrados.map((proyecto: any) => proyecto.nombre);
    
      }, (error) => {
        console.error("Error al cargar los proyectos:", error);
      });
    }
    async verificarExistenciaProyecto(nombre: string): Promise<boolean> {
      const existe = await firstValueFrom(this.firestoreService.projectExistsByName(nombre));
      return existe;
    }
    async verificarProyecto(nombre: string,updateData: any,selectedValue: any) {
      const updatedProjectData = this.document.value;
      
      const usuarioExiste = await this.verificarExistenciaProyecto(nombre.trim());
      if (usuarioExiste) {
        alert('Existe un proyecto ya registrado con este nombre');
      } else {
  
        if (Object.keys(updateData).length > 0) {
          this.firestoreService.getProjectByName('Proyecto', selectedValue)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const docId = doc.id;
                this.firestoreService.updateDocument('Proyecto', docId, updateData)
                  .then(() => {
                    this.emailService.sendEmail(this.correoUsuario+'', "Proyecto "+selectedValue+" Editado CrowdSpark", 'Los cambios a su proyecto '+selectedValue+' han sido correctamente realizados.').subscribe(
                      response => {
                        console.log('Correo enviado con éxito:', response);
                
                      },
                      error => {
                        console.error('Error al enviar el correo:', error);
                      }
                    );
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
      }
    updateProyecto() {
      // Se obtiene el valor de cada campo del formulario

      const selectElement = document.getElementById('proyectoSelect') as HTMLSelectElement; 
      const selectedValue = selectElement.value;
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
      this.verificarProyecto(updateData.nombre,updateData,selectedValue)
      
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