import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:4000/api/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(page: number = 1, limit: number = 50, searchTerm: string = '') {
    return this.http.get<{ productos: any[], total: number }>(
      `${this.apiUrl}/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
    );
  }

  crearProducto(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  actualizarProducto(id:string,data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarProducto(id:string,data: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, data);
  }
}
