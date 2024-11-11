import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  templateUrl: './events-admin.component.html',imports: [ReactiveFormsModule],
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent {
  title = 'Crear Evento';
  eventForm = new FormGroup({
    eventName: new FormControl('', Validators.required),
    presentationType: new FormControl('presencial', Validators.required),
    participants: new FormControl('', Validators.required),
    materials: new FormControl('', Validators.required)
  });

  constructor(private router: Router) {}
/*
  onCreateEvent() {
    if (this.eventForm.valid) {
      console.log('Evento creado:', this.eventForm.value);
      // Llama a un servicio para guardar el evento en la base de datos.
      this.router.navigate(['/main-admin']);
    }
  }*/

  goBack() {
    this.router.navigate(['/main-admin']);
  }
}
