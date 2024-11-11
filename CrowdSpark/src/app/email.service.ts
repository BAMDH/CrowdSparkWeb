import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'https://app-vv26jrb6sq-uc.a.run.app/email/send'; 

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string): Observable<any> {
    const emailData = { to, subject, text };

    return this.http.post(this.apiUrl, emailData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
