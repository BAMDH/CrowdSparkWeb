import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css'
})

export class CrearProyectoComponent {
  correoUsuario: string | null = null;
  nuevoProyecto: any;
  imagePreview: string | ArrayBuffer | null = null; // Para almacenar la vista previa de la imagen
  imageFile: File | null = null; // Para almacenar el archivo de imagen seleccionado
  notMentor: boolean = true;

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
    this.checkMentor();
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
  async verificarExistenciaProyecto(nombre: string): Promise<boolean> {
    const existe = await firstValueFrom(this.firestoreService.projectExistsByName(nombre));
    return existe;
  }
  async crearProyecto() {
    const usuarioExiste = await this.verificarExistenciaProyecto(this.nuevoProyecto['nombre'].trim());
    if (usuarioExiste) {
      alert('Existe un proyecto ya registrado con este nombre');
    } else {

      this.addProyecto(this.nuevoProyecto);
    }
    }
  onSubmit() {
    if (this.document.valid) {
      this.nuevoProyecto = {
        categoria: this.document.get('category')?.value,
        descripcion: this.document.get('projectDescription')?.value,
        fechaLimite: this.document.get('dueDate')?.value,
        imagen: this.imagePreview, 
        monto: 0,
        aprobado:false,
        nombre: this.document.get('projectName')?.value,
        objetivoFinanciacion: this.document.get('fundingGoal')?.value,
        idEncargado: this.correoUsuario,
      };
      this.crearProyecto()
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
        this.emailService.sendEmail(this.correoUsuario+'', "Proyecto "+nuevoProyecto['nombre']+" Creado CrowdSpark", 'Su proyecto '+nuevoProyecto['nombre']+' ha sido exitosamente creado.').subscribe(
          response => {
            console.log('Correo enviado con éxito:', response);
    
          },
          error => {
            console.error('Error al enviar el correo:', error);
          }
        );
        alert("Proyecto creado exitosamente.");
        this.router.navigate(['/pantalla-principal']);
      })
      .catch((error) => {
        alert("Error al crear el proyecto."+ error);
        console.error('Error al agregar el proyecto:', error);
      });
  }

  solicitarMentor() {
    // Lógica para solicitar mentor
    console.log("Se ha solicitado un mentor.");
    alert("¡Mentor solicitado exitosamente!");
    
    // Si deseas navegar a otra pantalla o realizar alguna acción adicional, puedes hacerlo aquí:
    // this.router.navigate(['/solicitar-mentor']);
  }

  checkMentor() {
    this.firestoreService.checkMentor(this.correoUsuario).subscribe((isMentor: boolean) => {
      this.notMentor = !isMentor;
    });
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
