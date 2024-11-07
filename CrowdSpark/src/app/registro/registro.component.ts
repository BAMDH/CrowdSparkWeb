import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../email.service';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  newUser : any;
  emailError: string | null = null;  // Variable para el mensaje de error
  passwordError: string | null = null;

  document = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    regEmail: new FormControl('', [Validators.required,this.validarEmail.bind(this)]),
    workArea: new FormControl('', [Validators.required]),
    initialAmount: new FormControl('', [Validators.required, this.validatePositiveNumber]),
    phone: new FormControl('', [Validators.required]),
    regPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  onSubmit() {
    this.validateEmailField();  // Validar correo antes de enviar el formulario
    this.validatePasswords();
    if (this.document.valid && !this.emailError && !this.passwordError) {
      this.newUser = {
        area: this.document.get('workArea')?.value,
        cedula: this.document.get('idNumber')?.value,
        correo: this.document.get('regEmail')?.value,
        dinero: this.document.get('initialAmount')?.value,
        estado: 'activo', // Mantener valor por defecto
        isMentor: false,  // Mantener valor por defecto
        nombre: this.document.get('fullName')?.value,
        password: this.document.get('regPassword')?.value,
        telefono: this.document.get('phone')?.value,
      };
      this.addUser(this.newUser);
      
    } else {
      console.log('Formulario inválido');
    }
  }

  /*Validador correo*/
  validarEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const allowedDomains = /@(estudiantec\.cr|itcr\.ac\.cr)$/;
    if (email && !allowedDomains.test(email)) {
      this.emailError = 'El correo debe terminar en @estudiantec.cr o @itcr.ac.cr';
      return { invalidEmail: true };
    }
    this.emailError = null; // Elimina el mensaje si el correo es válido
    return null;
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
    if (password && confirmPassword && password !== confirmPassword) {
      this.passwordError = 'Las contraseñas deben coincidir';
      this.document.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.passwordError = null;
      this.document.get('confirmPassword')?.setErrors(null);
    }
  }

  validateEmailField() {
    const emailControl = this.document.get('regEmail');
    if (emailControl) {
      this.validarEmail(emailControl);
      emailControl.updateValueAndValidity(); // Actualiza el estado del control después de la validación
    }
  }

  addUser(newUser: any) {
      // Llamamos al servicio para agregar el documento
      this.firestoreService.addDocument('Usuarios', newUser)
        .then(() => {
          console.log('Usuario agregado correctamente');
          alert("Registro exitoso.");
          this.router.navigate(['/inicio'])
        })
        .catch((error) => {
          alert("Llene todos los campos.");
          console.error('Error al agregar el usuario:', error);
        });
  }
  cambiarPantalla() {
    this.router.navigate(['/inicio']);
  }
}
