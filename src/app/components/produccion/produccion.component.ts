import { Component } from '@angular/core';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { PanelComponent } from '../panel/panel.component';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { CotizacionService } from '../../services/cotizacion.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-produccion',
  imports: [
    NavegacionComponent,
    PanelComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
})
export class ProduccionComponent {

  editDesc: boolean = true;
  detForm :FormGroup;
  pAct:string = "";

  clienteForm: FormGroup;
  idCliente: string = '';
  clienteActual: any;

  message: string = '';
  currentDate: string = new Date().toISOString().split('T')[0];

  idProducto: string = '';

  listCotizacion: any[] = [];
  filerCot: any[] = [];
  totalCotizacion: number = 0;
  descuento: number = 3;

  isOpen = false;
  allProductos: any[] = [];
  listProductos: any[] = [];
  searchTerm: string = '';
  searchCot: string = '';

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Número de productos por página
  totalItems: number = 0; // Total de productos en la base de datos
  totalPages: number = 0; // Total de páginas

  constructor(
    private _productoService: ProductoService,
    private router: Router,
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private _cotizacionService: CotizacionService,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
      observaciones: ['', Validators.required],
    });
    this.detForm = this.fb.group({
      observaciones:[''],
      id:[0]
    })
  }

  cargarDetalles(producto: any, index:number) {
    this.isOpen = true; // Abre el modal
    this.pAct = producto.nombre;
    this.detForm.patchValue({
      observaciones: producto.observaciones,
      id:index
    });
  }

  ngOnInit() {
    this.filtrarProductos()
  }

  mostar() {
    console.log(this.listCotizacion);
  }

  crearCliente(): Promise<any> {
    this.clienteActual = this.clienteForm.value;
    return new Promise((resolve, reject) => {
      this._clienteService.crearCliente(this.clienteForm.value).subscribe({
        next: (response) => {
          this.idCliente = response._id;
          console.log('Cliente creado con éxito:', response);
          this.message = 'Cliente creado exitosamente.';
          this.clienteForm.reset();
          resolve(response); // Resolvemos la promesa con el cliente creado
        },
        error: (error) => {
          this.message = 'Error al crear cliente. Verifica los datos.';
          console.error('Error:', error);
          reject(error); // Rechazamos la promesa en caso de error
        },
      });
    });
  }

  async crearCotizacion() {
    try {
      const clienteCreado = await this.crearCliente();

      if (!clienteCreado || !clienteCreado._id) {
        throw new Error('No se obtuvo el ID del cliente.');
      }

      const productosFiltrados = this.listCotizacion.map((producto) => ({
        _id: producto._id,
        cantidad: producto.cantidad,
        observaciones: producto.observaciones,
        subtotal:producto.subtotal
      }));

      console.log(productosFiltrados);

      const cotizacionData = {
        idCliente: clienteCreado._id,
        productos: productosFiltrados,
        total:this.totalCotizacion,
        descuento:this.descuento
      };

      this._cotizacionService.crearCotizacion(cotizacionData).subscribe({
        next: (response) => {
          console.log('Cotización creada:', response);
          this.generarPDF();
          this.showSuccess('Cotizacion guardad con éxito');
          this.listCotizacion = [];
          this.filerCot = [];
          this.totalCotizacion = 0;
          this.descuento=3;
        },
        error: (error) => {
          this.showError('No se pudo guardar la cotizacion');
        },
      });
    } catch (error) {
      console.error('Error en el proceso de creación:', error);
    }
  }


  filtrarCotizacion() {
    if (this.searchCot.trim() !== '') {
      this.filerCot = this.listCotizacion.filter((producto) =>
        producto.nombre.toLowerCase().includes(this.searchCot.toLowerCase())
      );
    } else {
      this.filerCot = [...this.listCotizacion];
    }
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

  cambiarPagina(nuevaPagina: number) {
    this.currentPage = nuevaPagina;
    this.filtrarProductos();
  }

  // Función para añadir producto a la cotización
  agregarACotizacion(producto: any) {
    const existe = this.listCotizacion.find(
      (item) => item._id === producto._id
    );
    if (!existe) {
      this.listCotizacion.push({
        ...producto,
        cantidad: 1,
        observaciones: '',
        subtotal: producto.precio * 1,
      }); // Se agrega con cantidad 1 por defecto
      this.filtrarCotizacion();
      this.actualizarTotal();
      console.log(this.listCotizacion);
    } else {
      alert('Este producto ya está en la cotización');
    }
  }

  cambiarObservacion(): void {
    const p = this.detForm.value
    if (p.id >= 0 && p.id < this.listCotizacion.length) {
      this.listCotizacion[p.id].observaciones = p.observaciones;
      this.filtrarCotizacion(); // Si necesitas volver a filtrar la cotización
      this.actualizarTotal(); // Si necesitas recalcular el total
      this.isOpen=false;
    } else {
      console.error('Índice fuera de rango');
    }
  }

  actualizarTotal() {
    this.totalCotizacion = this.listCotizacion.reduce((sum, item) => {
      item.subtotal = item.precio * item.cantidad; 
      return sum + item.subtotal;
    }, 0) * (1 - this.descuento / 100);
  }
  

  cambiarCantidad(index: number, event: any) {
    const cantidad = event.target.value;
    if (cantidad < 1) {
      this.listCotizacion[index].cantidad = 1;
    } else {
      this.listCotizacion[index].cantidad = cantidad;
    }
    this.actualizarTotal();
  }

  eliminarDeCotizacion(index: number) {
    this.listCotizacion.splice(index, 1);
    this.filtrarCotizacion();
    this.actualizarTotal();
  }

  generarPDF() {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Agregar Logo (ajusta la ruta y el tamaño)
    const logoPath = 'logoLumart.png'; // Ruta del logo en tu proyecto
    doc.addImage(logoPath, 'PNG', 10, 10, 40, 15);

    // Colores y estilos
    const primaryColor = '##FF4837'; // Azul oscuro
    const secondaryColor = '#ECF0F1'; // Gris claro
    const accentColor = '#E74C3C'; // Rojo (para descuentos)

    // Título
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text('COTIZACIÓN', 105, 30, { align: 'center' });

    // Número de cotización
    doc.setFontSize(14);
    doc.setTextColor('#000');
    doc.text(`#${2025}`, 105, 38, { align: 'center' });

    // Datos del Cliente (Fondo gris claro)
    doc.setFillColor(secondaryColor);
    doc.rect(10, 45, 190, 20, 'F');

    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.text(`CLIENTE: ${this.clienteActual.nombre}`, 12, 50);
    doc.text(`DIRECCIÓN: ${this.clienteActual.direccion}`, 12, 56);
    doc.text(`DNI: ${this.clienteActual.dni}`, 150, 50);
    doc.text(`FECHA: ${this.clienteActual.fecha}`, 150, 56);

    // Tabla de Productos con Sombra en Encabezados
    autoTable(doc, {
      startY: 70,
      head: [['ITEM', 'DESCRIPCIÓN', 'U.M', 'CANT', 'P.U', 'TOTAL']],
      body: this.listCotizacion.map((prod, index) => [
        index + 1,
        prod.nombre,
        prod.und,
        prod.cantidad,
        `S/ ${prod.precio.toFixed(2)}`,
        `S/ ${(prod.cantidad * prod.precio).toFixed(2)}`,
      ]),
      styles: { fontSize: 9, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: primaryColor, textColor: '#FFF' },
      alternateRowStyles: { fillColor: secondaryColor },
      theme: 'striped',
    });

    // Totales (Sombreado con Rojo si hay descuento)
    const totalY = (doc as any).autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.text(`TOTAL: S/ ${this.totalCotizacion.toFixed(2)}`, 150, totalY);

    // Si hay descuento, resaltarlo en rojo
    if (true) {
      doc.setTextColor(accentColor);
      doc.text(`DESCUENTO: S/ ${12}`, 150, totalY + 6);
      doc.setTextColor('#000');
      doc.text(
        `MONTO FINAL: S/ ${(this.totalCotizacion - 12).toFixed(2)}`,
        150,
        totalY + 12
      );
    }

    // Guardar y Descargar
    doc.save(`Cotizacion_${2025}.pdf`);
  }

  showSuccess(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, // Duración en milisegundos
      panelClass: ['success-snack-bar'],
    });
  }

  showError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snack-bar'], // Aplica la clase del snackbar de error
    });
  }
}
