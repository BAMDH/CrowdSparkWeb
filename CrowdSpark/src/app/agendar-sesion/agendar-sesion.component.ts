import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { EmailService } from '../email.service';
import { UsuarioService } from '../services/usuario.service';
@Component({
  selector: 'app-agendar-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './agendar-sesion.component.html',
  styleUrl: './agendar-sesion.component.css'
})
export class AgendarSesionComponent {
  agendarForm: FormGroup;
  projects: any[] = [];
  correoUsuario: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.agendarForm = this.fb.group({
      project: ['', Validators.required],
      sessionDate: ['', Validators.required],
      sessionTime: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
    this.correoUsuario = this.usuarioService.getCorreoUsuario();
  }

  ngOnInit(): void {
    this.loadProjects();
  }
  // Método para guardar o enviar el formulario
  onSubmit() {
    if (this.agendarForm.valid) {
      const newSession = {
        project: this.agendarForm.get('project')?.value,
        sessionDate: this.agendarForm.get('sessionDate')?.value,
        sessionTime: this.agendarForm.get('sessionTime')?.value,
        price: this.agendarForm.get('price')?.value,
        mentor: this.correoUsuario,
        pagado: false
      };
      this.addSesion(newSession);
    }
  }

  cambiarPantalla() {
    this.router.navigate(['/pagina-mentor']);
  }

  loadProjects() {
    this.firestoreService.getProyectosByMentor(this.correoUsuario).subscribe((data: any[]) => {
      this.projects = data.map(project => ({
        nombre: project.proyecto,
      }));
    });
  }
  addSesion(newSession: any) {
    // Llamamos al servicio para agregar el documento
    this.firestoreService.addDocument('Sesion', newSession)
      .then(() => {
        this.emailService.sendEmail(this.correoUsuario + '', "Sesion agendada", 'Sesion agendada para ' + newSession['sessionDate'] + ' a las ' + newSession['sessionTime'] + ' para el proyecto ' + newSession['project'] + ' con un precio de ' + newSession['price']).subscribe(
          response => {
            console.log('Correo enviado con éxito:', response);
    
          },
          error => {
            console.error('Error al enviar el correo:', error);
          }
        );
        console.log('Sesion agregada correctamente');
        alert("Sesion agendada exitosamente.");
        this.router.navigate(['/pagina-mentor'])
      })
      .catch((error) => {
        alert("Llene todos los campos.");
        console.error('Error al agendar sesion:', error);
      });
  }

}
