import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  segment: 'login' | 'register' = 'login';
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['']
  });
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  onSegmentChange(value: 'login' | 'register') {
    this.segment = value;
    this.error = '';
    // toggle confirmPassword validator
    if (value === 'register') {
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.form.get('confirmPassword')?.clearValidators();
    }
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  async submit() {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Preencha todos os campos corretamente.';
      return;
    }
    const { username, password, confirmPassword } = this.form.value;
    if (this.segment === 'register' && password !== confirmPassword) {
      this.error = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    try {
      if (this.segment === 'login') {
        await this.auth.login(username, password).toPromise();
      } else {
        await this.auth.register(username, password).toPromise();
      }
      // navegar para a tela principal do jogo (adicione rota /home)
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      this.error = e?.message || 'Ocorreu um erro.';
    } finally {
      this.loading = false;
    }
  }
}