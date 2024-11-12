import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  templateUrl: './events-admin.component.html',imports: [ReactiveFormsModule],
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent {
  title = 'Crear Evento';
  eventForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    tipo: new FormControl('Presencial', Validators.required),
    participantes: new FormControl('', Validators.required),
    materiales: new FormControl('', Validators.required)
  });

  constructor(private router: Router,
    private firestoreService: FirestoreService) {}
/*
  onCreateEvent() {
    if (this.eventForm.valid) {
      console.log('Evento creado:', this.eventForm.value);
      // Llama a un servicio para guardar el evento en la base de datos.
      this.router.navigate(['/main-admin']);
    }
  }*/
 onSubmit(){
  const formData = this.eventForm.value;
  this.addEvento(formData)
 }
addEvento(evento: any) {
    this.firestoreService.addDocument('Eventos', evento)
      .then(() => {
        console.log('Evento agregado correctamente');
        alert("Evento creado exitosamente.");
        this.router.navigate(['/main-admin']);

      })
      .catch((error) => {
        alert("Error al crear el Evento." + error);
        console.error('Error al agregar el Evento:', error);
      });
  }
  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
