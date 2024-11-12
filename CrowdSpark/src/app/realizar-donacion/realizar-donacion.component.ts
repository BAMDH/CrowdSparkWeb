import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-realizar-donacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './realizar-donacion.component.html',
  styleUrl: './realizar-donacion.component.css'
})
export class RealizarDonacionComponent {
  proyecto: any;
  donationForm: FormGroup;
  correoUsuario: string | null = null;
  nombreDonante: string | null = null;
  telefonoDonante: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.correoUsuario = this.usuarioService.getCorreoUsuario(),
    this.donationForm = new FormGroup({
      donationAmount: new FormControl('', [
        Validators.required,
        Validators.min(1),
        this.validAmount // Validador personalizado
      ])
    }); 
  }

  ngOnInit(): void {
    // Obtener los datos del usuario (nombre y teléfono)
    if (this.correoUsuario) {
      this.firestoreService.getUsuariosByCorreo(this.correoUsuario).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          this.nombreDonante = data['nombre'];
          this.telefonoDonante = data['telefono'];
        });
      });
    }

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

  // Validador personalizado para asegurarse de que el monto sea un número entero positivo
  validAmount(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value <= 0) {
      return { invalidAmount: true };
    }
    return null;
  }

  onSubmit() {
    if (this.donationForm.valid) {
      const amount = this.donationForm.get('donationAmount')?.value;
  
      // Paso 1: Obtener el documento del usuario desde la colección Usuarios
      this.firestoreService.getUsuariosByCorreo(this.correoUsuario!).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const usuarioDoc = querySnapshot.docs[0];
          const usuarioData = usuarioDoc.data();
          const dineroDisponible = usuarioData['dinero']; // Obtener el dinero disponible del usuario
  
          // Paso 2: Verificar si el usuario tiene suficiente dinero para donar
          if (dineroDisponible >= amount) {
            const fechaDonacion = new Date().toISOString(); // Fecha actual en formato ISO
            const nombreProyecto = this.proyecto.nombre;
  
            // Paso 3: Registrar la donación
            const donacionData = {
              monto: amount,
              correo: this.correoUsuario,
              nombreDonante: usuarioData['nombre'],
              nombreProyecto: nombreProyecto,
              telefono: usuarioData['telefono'],
              fechaDonacion: fechaDonacion
            };
  
            // Agregar la donación a la colección Donacion
            this.firestoreService.addDocument('Donacion', donacionData)
              .then(() => {
                // Paso 4: Actualizar el dinero restante en la colección Usuarios
                const nuevoDinero = dineroDisponible - amount;
                this.firestoreService.updateDocument('Usuarios', usuarioDoc.id, { dinero: nuevoDinero })
                  .then(() => {
                    // Paso 5: Actualizar el monto en el proyecto correspondiente
                    this.firestoreService.getProjectByName('Proyecto', nombreProyecto).then((projectQuerySnapshot) => {
                      if (!projectQuerySnapshot.empty) {
                        const projectDoc = projectQuerySnapshot.docs[0];
                        const projectData = projectDoc.data();
                        const montoActual = projectData['monto'] || 0; // Obtener el monto actual del proyecto
                        const nuevoMontoProyecto = montoActual + amount;
  
                        // Actualizar el monto en el documento del proyecto
                        this.firestoreService.updateDocument('Proyecto', projectDoc.id, { monto: nuevoMontoProyecto })
                          .then(() => {
                            this.emailService.sendEmail(this.correoUsuario+'', "Donación Realizada CrowdSpark", 'Gracias por donar '+ amount + ' al proyecto '+nombreProyecto).subscribe(
                              response => {
                                console.log('Correo enviado con éxito:', response);
                        
                              },
                              error => {
                                console.error('Error al enviar el correo:', error);
                              }
                            );
                            console.log(projectData);
                            this.emailService.sendEmail(projectData['idEncargado']+'', "Donación Recibida CrowdSpark", 'Ha recibido una ayuda de '+ amount + ' para su proyecto '+nombreProyecto).subscribe(
                              response => {
                                console.log('Correo enviado con éxito:', response);
                        
                              },
                              error => {
                                console.error('Error al enviar el correo:', error);
                              }
                            );
                            alert(`¡Donación de $${amount} realizada correctamente!`);
                            this.router.navigate(['/pantalla-principal']);
                          })
                          .catch(error => {
                            console.error("Error al actualizar el monto del proyecto: ", error);
                          });
                      } else {
                        console.error("No se encontró el proyecto especificado.");
                      }
                    }).catch(error => {
                      console.error("Error al obtener el proyecto: ", error);
                    });
                  })
                  .catch(error => {
                    console.error("Error al actualizar el dinero del usuario: ", error);
                  });
              })
              .catch(error => {
                console.error("Error al agregar la donación: ", error);
              });
          } else {
            // Mostrar mensaje de error si el dinero es insuficiente
            alert("No tienes suficiente dinero para realizar esta donación.");
          }
        } else {
          console.error("No se encontró el usuario con el correo especificado.");
        }
      }).catch(error => {
        console.error("Error al obtener los datos del usuario: ", error);
      });
    }
  }
  
  
  // Función para navegar de vuelta
  volver() {
    this.router.navigate(['/pantalla-principal']);
    }
}