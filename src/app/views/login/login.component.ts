import {Component, inject, OnInit} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from './auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserInterface } from './user.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDividerModule, MatButtonModule, MatCardModule, RouterModule],
})

export class LoginComponent implements OnInit {
    authService = inject(AuthService);
    router = inject(Router);

    hidePassword = true;

    user: UserInterface = {
        email: '',
        username: '',
        password: ''
    }
    
    form: FormGroup;

    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }

    ngOnInit(): void {
    }

    errorMessage: string | null = null;

    login(): void {
        if (this.form.valid) {
            this.authService.login(
                this.form.controls['email'].value!, 
                this.form.controls['password'].value!
            )
            .subscribe({
                next: () => {},
                error: (err) => {
                    this.errorMessage = err.code;
                    if (err.code == 'auth/invalid-credential') {  
                        this.authService.showMessage('Credencial inválida', true);
                    }
                    else{
                        this.authService.showMessage('Error', true);
                    }
                }
            })
        }
    }


  

}
