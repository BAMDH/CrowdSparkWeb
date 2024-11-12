import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent {
  emailError: string | null = null;
  passwordError: string | null = null;
  correoUsuario: string | null = null;

  document = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    workArea: new FormControl('', [Validators.required]),
    initialAmount: new FormControl('', [this.validatePositiveNumber]),
    phone: new FormControl('', [Validators.required]),
    regPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
    mentorReasons: new FormControl('', [Validators.required])  // Nuevo campo para razones de ser mentor
  });

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.correoUsuario = this.usuarioService.getCorreoUsuario();
  }

  ngOnInit(): void {
    this.cargarUsuario(this.usuarioService.getCorreoUsuario()+'');
  }

  cargarUsuario(correo: string) {
    this.firestoreService.getUsuariosByCorreo(correo).then(snapshot => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        this.document.patchValue({
          fullName: userData['nombre'],
          idNumber: userData['cedula'],
          workArea: userData['area'],
          initialAmount: userData['dinero'],
          phone: userData['telefono']
        });
      } else {
        console.log('No se encontró ningún usuario con este correo');
      }
    }).catch(error => {
      console.error('Error al cargar el usuario:', error);
    });
  }

  sendMentorRequest() {
    const reasons = this.document.get('mentorReasons')?.value;
    const to = 'crowdspark58@gmail.com';  
    const subject = 'Solicitud de Posición de Mentor';
    const nombre = this.document.get('fullName')?.value;
    const correo = this.correoUsuario;
    const body = 'Nombre: ' + nombre + ', Correo: ' + correo + `, Razones para querer ser mentor:\n\n${reasons}`;


    this.emailService.sendEmail(to, subject, body).subscribe(
      response => {
        console.log('Correo enviado con éxito:', response);
        alert('Solicitud de mentor enviada exitosamente.');
      },
      error => {
        console.error('Error al enviar el correo:', error);
        alert('Error al enviar la solicitud.');
      }
    );
  }

  updateUsuario() {
    // código de updateUsuario ...
  }

  validatePositiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return { invalidAmount: true };
    }
    return null;
  }

  validatePasswords() {
    const password = this.document.get('regPassword')?.value;
    const confirmPassword = this.document.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.passwordError = 'Las contraseñas deben coincidir';
      this.document.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.passwordError = null;
      this.document.get('confirmPassword')?.setErrors(null);
    }
  }

  cambiarPantalla() {
    this.router.navigate(['/pantalla-principal']);
  }
}
