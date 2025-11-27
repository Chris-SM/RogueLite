import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Troque pela URL da sua API quando existir (ou mantenha em mock)
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Se tiver backend, descomente as chamadas http e comente o mock.
  login(username: string, password: string): Observable<any> {
    // Mock local rápido
    if (!username || !password) return throwError(() => new Error('Credenciais inválidas'));
    // Simula sucesso
    return of({ ok: true, user: { username } }).pipe(delay(600));
    // Exemplo com backend:
    // return this.http.post(`${this.API_URL}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    if (!username || !password) return throwError(() => new Error('Dados inválidos'));
    return of({ ok: true }).pipe(delay(800));
    // Exemplo com backend:
    // return this.http.post(`${this.API_URL}/register`, { username, password });
  }

  // método extra para futuramente armazenar token/localStorage
  saveSession(payload: any) {
    localStorage.setItem('session', JSON.stringify(payload));
  }
}