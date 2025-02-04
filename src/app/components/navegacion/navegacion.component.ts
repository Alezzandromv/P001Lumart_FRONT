import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navegacion',
  imports: [RouterModule],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {
  constructor(
    private _authService:AuthService,
    private router: Router
  ){}

  cerrarSesion(){
    this._authService.logout();
    this.router.navigate(['/']);
  }

}
