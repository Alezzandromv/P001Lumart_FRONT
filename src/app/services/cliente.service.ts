import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:4000/api/cliente';

  constructor(private http: HttpClient) {}

  crearCliente(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
