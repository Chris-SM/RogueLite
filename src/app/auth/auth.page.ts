// import { Component } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { RouterModule, Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Component({
//   selector: 'app-auth',
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './auth.page.html',
//   styleUrls: ['./auth.page.scss']
// })
// export class AuthPage {
//   segment: 'login' | 'register' = 'login';
//   form = this.fb.group({
//     username: ['', [Validators.required, Validators.minLength(3)]],
//     password: ['', [Validators.required, Validators.minLength(4)]],
//     confirmPassword: ['']
//   });
//   loading = false;
//   error = '';

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   onSegmentChange(value: 'login' | 'register') {
//     this.segment = value;
//     this.error = '';
//     // toggle confirmPassword validator
//     if (value === 'register') {
//       this.form.get('confirmPassword')?.setValidators([Validators.required]);
//     } else {
//       this.form.get('confirmPassword')?.clearValidators();
//     }
//     this.form.get('confirmPassword')?.updateValueAndValidity();
//   }

//   async submit() {
//     this.error = '';
//     if (this.form.invalid) {
//       this.error = 'Preencha todos os campos corretamente.';
//       return;
//     }
//     const { username, password, confirmPassword } = this.form.value;
//     if (this.segment === 'register' && password !== confirmPassword) {
//       this.error = 'As senhas não coincidem.';
//       return;
//     }
//     this.loading = true;
//     try {
//       if (this.segment === 'login') {
//         await this.auth.login(username, password).toPromise();
//       } else {
//         await this.auth.register(username, password).toPromise();
//       }
//       // navegar para a tela principal do jogo (adicione rota /home)
//       this.router.navigateByUrl('/home', { replaceUrl: true });
//     } catch (e: any) {
//       this.error = e?.message || 'Ocorreu um erro.';
//     } finally {
//       this.loading = false;
//     }
//   }
// }

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service'; // ajuste caminho se necessário

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  segment: 'login' | 'register' = 'login';
  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    displayName: [''],
    confirmPassword: ['']
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  onSegmentChange(value: 'login' | 'register') {
    this.segment = value;
    this.error = '';
    if (value === 'register') {
      this.form.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('displayName')?.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      this.form.get('confirmPassword')?.clearValidators();
      this.form.get('displayName')?.clearValidators();
    }
    this.form.get('confirmPassword')?.updateValueAndValidity();
    this.form.get('displayName')?.updateValueAndValidity();
  }

  async submit() {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Preencha todos os campos corretamente.';
      return;
    }

    const { email, password, confirmPassword, displayName } = this.form.value;
    if (this.segment === 'register' && password !== confirmPassword) {
      this.error = 'As senhas não coincidem.';
      return;
    }

    this.loading = true;
    try {
      // declara explicitamente como string
      let uid: string;

      // Se, por algum motivo, o TS ainda não enxergar o tipo, usamos cast seguro
      if (this.segment === 'login') {
        uid = (await this.auth.login(email!, password!)) as string;
      } else {
        uid = (await this.auth.register(email!, password!, displayName!)) as string;
      }

      // guarda uid — aqui uid é string garantida
      localStorage.setItem('uid', uid);

      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      console.error(err);
      this.error = this.mapAuthError(err);
    } finally {
      this.loading = false;
    }
  }

  private mapAuthError(err: any) {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'E-mail já em uso.';
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/weak-password':
        return 'Senha fraca. Use ao menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente mais tarde.';
      default:
        return err?.message || 'Ocorreu um erro durante a autenticação.';
    }
  }
}