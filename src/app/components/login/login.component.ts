import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
          });
    }
    onLogin() {

      if (this.loginForm.invalid) {
          this.message = 'Por favor completa los campos correctamente.';
          return;
        }
      const loginData = this.loginForm.value;
      console.log(loginData);
      this.authService.login(loginData).subscribe(
          (response: any) => {
              // Guardar el token en el localStorage
              localStorage.setItem('token', response.token);
  
              // Redirigir al usuario a la página principal o dashboard
              this.router.navigate(['/dashboard']);
          },
          (error) => {
              // Mostrar mensaje de error
              this.message = 'Error al iniciar sesión. Verifica tus credenciales.';
              console.log(this.message);
          }
      );
  }
}
