import { Component, OnInit } from '@angular/core';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { PanelComponent } from '../panel/panel.component';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  imports: [NavegacionComponent, PanelComponent, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  isOpen=false;
  listProductos:any []=[];
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Número de productos por página
  totalItems: number = 0; // Total de productos en la base de datos
  totalPages: number = 0; // Total de páginas


  constructor(
    private _productoService: ProductoService
  ){}

  ngOnInit(){
    this.obtenerProductos();
  }

  obtenerProductos(){
    this._productoService.obtenerProductos().subscribe(data=>{
      console.log(data);
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.listProductos = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    
    }, error=>{
      console.log(error);
    })   
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.obtenerProductos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.obtenerProductos();
    }
  }

}
