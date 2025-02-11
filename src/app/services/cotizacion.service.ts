import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private apiUrl = 'http://localhost:4000/api/cotizacion';

  constructor(private http: HttpClient) {}

  crearCotizacion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
