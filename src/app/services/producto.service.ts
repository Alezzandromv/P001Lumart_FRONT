import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductoService {
    private apiUrl = 'http://localhost:4000/api/productos';

    constructor(private http: HttpClient) {}

    obtenerProductos(): Observable<any[]> {
        return this.http.get<any>(this.apiUrl).pipe(  // Cambia la respuesta a 'any' para tener el objeto completo
          map(response => response.productos)  // Accede a la propiedad 'productos' que contiene el array
        );
      }

}
