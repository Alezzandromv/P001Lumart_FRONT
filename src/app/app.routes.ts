import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PanelComponent } from './components/panel/panel.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProduccionComponent } from './components/produccion/produccion.component';

export const routes: Routes = [
    {path:'', component:LoginComponent}, //ruta inicial, login
    {path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard] },
    {path: 'inventario', component:InventarioComponent, canActivate: [AuthGuard] },
    {path: 'produccion', component:ProduccionComponent, canActivate: [AuthGuard] }
];
