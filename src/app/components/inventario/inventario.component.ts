import { Component, OnInit } from '@angular/core';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { PanelComponent } from '../panel/panel.component';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: true,
  selector: 'app-inventario',
  imports: [
    FormsModule,
    NavegacionComponent,
    PanelComponent,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent {
  productForm: FormGroup;
  message: string = '';

  idProducto: string = '';

  isOpen = false;
  allProductos: any[] = [];
  listProductos: any[] = [];
  searchTerm: string = '';

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 20; // Número de productos por página
  totalItems: number = 0; // Total de productos en la base de datos
  totalPages: number = 0; // Total de páginas

  constructor(
    private _productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      categorias: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      und: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.filtrarProductos();
  }

  
  filtrarProductos() {
    this._productoService.obtenerProductos(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.listProductos = data.productos;
          this.totalItems = data.total;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        },
        error: (error) => {
          console.error('Error al obtener productos:', error);
        }
      });
  }
  
  // Método para cambiar de página
  cambiarPagina(nuevaPagina: number) {
    this.currentPage = nuevaPagina;
    this.filtrarProductos();
  }

  eliminarProducto(id:string, data:any){
    this._productoService.eliminarProducto(id, data).subscribe(
      (data) => {
        this.showSuccess('Producto Eliminado con éxito');
        this.filtrarProductos();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //crear producto
  crearProducto() {
    if (this.productForm.invalid) {
      this.message = 'Por favor completa los campos correctamente.';
      return;
    }

    if (this.idProducto!='') {
      console.log(this.productForm.value)
      this._productoService.actualizarProducto(this.idProducto,this.productForm.value).subscribe({
        next: (response) => {
          console.log('Producto actualizado con éxito:', response);
          this.message = 'Producto creado exitosamente.';
          this.isOpen = false;
          this.productForm.reset();
          this.filtrarProductos();
          this.showSuccess('Producto actualizado con éxito');
          this.idProducto='';
        },
        error: (error) => {
          this.message = 'Error al actualizar producto. Verifica los datos.';
          console.error('Error:', error);
          this.showError();
        },
      });
    } else {
      this._productoService.crearProducto(this.productForm.value).subscribe({
        next: (response) => {
          console.log('Producto creado con éxito:', response);
          this.message = 'Producto creado exitosamente.';
          this.isOpen = false;
          this.productForm.reset();
          this.filtrarProductos();
          this.showSuccess('Producto creado con éxito');
        },
        error: (error) => {
          this.message = 'Error al crear producto. Verifica los datos.';
          console.error('Error:', error);
          this.showError();
        },
      });
    }
  }

  cerrar(){
    this.productForm.reset();
    this.isOpen=false;
  }

  //EDITAR PRODUCTO
  cargarProducto(producto: any) {
    this.isOpen = true; // Abre el modal
    this.productForm.patchValue({
      nombre: producto.nombre,
      categorias: producto.categorias,
      precio: producto.precio,
      stock: producto.stock,
      und: producto.und,
    });

    this.idProducto = producto._id;
    console.log(this.idProducto); // Guarda el ID para actualizar el producto
  }

  showSuccess(mensaje:string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, // Duración en milisegundos
      panelClass: ['success-snack-bar'],
    });
  }

  showError() {
    this.snackBar.open('¡No se pudo crear el producto!', 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snack-bar'], // Aplica la clase del snackbar de error
    });
  }
}
