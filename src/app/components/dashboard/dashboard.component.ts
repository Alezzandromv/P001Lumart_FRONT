import { Component } from '@angular/core';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavegacionComponent, PanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
