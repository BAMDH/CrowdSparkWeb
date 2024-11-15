import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css'
})

export class CrearProyectoComponent {
  correoUsuario: string | null = null;
  nuevoProyecto: any;
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  notMentor: boolean = true;
  showMentorCombobox: boolean = false;
  mentors: any[] = [];
  selectedMentor: string = '';
  selectedMentorEmail: string = '';
  mentoria: any;
  imageRequired: boolean = false; // Nueva propiedad para controlar el mensaje de error

  document = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
    fundingGoal: new FormControl('', [Validators.required, this.validatePositiveNumber]),
    category: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    mentor: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.correoUsuario = this.usuarioService.getCorreoUsuario();
  }

  ngOnInit() {
    this.checkMentor();
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file); // Convierte la imagen a base64
      this.imageFile = file; // Guarda el archivo para su posterior carga
      this.imageRequired = false; // Resetea el mensaje de error cuando se selecciona una imagen
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
    if (this.document.valid && this.imageFile) {
      this.nuevoProyecto = {
        categoria: this.document.get('category')?.value,
        descripcion: this.document.get('projectDescription')?.value,
        fechaLimite: this.document.get('dueDate')?.value,
        imagen: this.imagePreview,
        monto: 0,
        aprobado: false,
        nombre: this.document.get('projectName')?.value,
        objetivoFinanciacion: this.document.get('fundingGoal')?.value,
        idEncargado: this.correoUsuario,
      };
      this.crearProyecto();
      
    } else {
      this.document.markAllAsTouched();  // Marca todos los campos como tocados para activar los errores
      this.imageRequired = !this.imageFile; // Establece el error si falta la imagen
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
    this.firestoreService.addDocument('Proyecto', nuevoProyecto)
      .then(() => {
        console.log('Proyecto agregado correctamente');
        this.emailService.sendEmail(this.correoUsuario + '', "Proyecto " + nuevoProyecto['nombre'] + " Creado CrowdSpark", 'Su proyecto ' + nuevoProyecto['nombre'] + ' ha sido exitosamente creado.').subscribe(
          response => {
            console.log('Correo enviado con éxito:', response);
          },
          error => {
            console.error('Error al enviar el correo:', error);
          }
        );
        if (this.selectedMentor !== '') {
          this.mentoria = {
            mentor: this.selectedMentorEmail,
            proyecto: this.nuevoProyecto['nombre'],
            aceptado: false
          };
          this.addMentor(this.mentoria);
        }else{
          console.log('No se seleccionó mentor');
        }
        this.router.navigate(['/pantalla-principal']);
        alert("Proyecto creado exitosamente.");
      })
      .catch((error) => {
        alert("Error al crear el proyecto." + error);
        console.error('Error al agregar el proyecto:', error);
      });
  }

  solicitarMentor() {
    this.showMentorCombobox = !this.showMentorCombobox;
    if (this.showMentorCombobox) {
      this.loadMentors();
    }
  }

  onMentorChange(event: any) {
    const selectedMentorName = event.target.value;
    const selectedMentor = this.mentors.find(mentor => mentor.nombre === selectedMentorName);
    if (selectedMentor) {
      this.selectedMentorEmail = selectedMentor.correo;
      this.selectedMentor = selectedMentor.nombre;
    }
  }
  addMentor(newMentor: any) {
    this.firestoreService.addDocument('Mentoria', newMentor)
      .then(() => {
        this.emailService.sendEmail(this.correoUsuario + '', "Solicitud Mentor", 'Solicitud de mentor ' + this.selectedMentor + ' enviada exitosamente.').subscribe(
          response => {
            console.log('Correo enviado con éxito:', response);
          },
          error => {
            console.error('Error al enviar el correo:', error);
          }
        );
        console.log('Solicitud enviada correctamente');
        alert("Solicitud enviada exitosamente.");
        this.router.navigate(['/pantalla-principal']);
      })
      .catch((error) => {
        alert("Seleccione su mentor.");
        console.error('Error al solicitar mentor:', error);
      });
  }

  loadMentors() {
    this.firestoreService.getMentors().subscribe((mentors: any[]) => {
      this.mentors = mentors;
    });
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