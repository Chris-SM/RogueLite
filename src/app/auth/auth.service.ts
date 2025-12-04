import { Injectable } from '@angular/core';
import { firebaseConfig } from './environment'; // ajuste caminho se necessário
import { getApps, initializeApp, FirebaseApp, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, set, Database } from 'firebase/database';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app: FirebaseApp;
  private auth: ReturnType<typeof getAuth>;
  private db: Database;

  constructor() {
    if (!getApps().length) {
      this.app = initializeApp(firebaseConfig as any);
    } else {
      this.app = getApp();
    }
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
  }

  // retorna UID (string) sempre
  async register(email: string, password: string, displayName?: string): Promise<string> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = cred.user as User;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    const uid: string = user.uid;
    await set(ref(this.db, `users/${uid}`), {
      uid,
      displayName: displayName || user.email?.split('@')[0] || '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalRuns: 0,
      bestFloor: 0,
      preferences: { sound: true, difficulty: 'normal' }
    });

    return uid;
  }

  // retorna UID (string) sempre
  async login(email: string, password: string): Promise<string> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const user = cred.user as User;
    const uid: string = user.uid;
    await set(ref(this.db, `users/${uid}/lastLoginAt`), new Date().toISOString());
    return uid;
  }

  logout() {
    return signOut(this.auth);
  }

  onAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  currentUser(): User | null {
    return this.auth.currentUser;
  }

  // Wrappers opcionais
  login$(email: string, password: string): Observable<any> {
    return from(this.login(email, password));
  }

  register$(email: string, password: string, displayName?: string): Observable<any> {
    return from(this.register(email, password, displayName));
  }
}

// import { Injectable } from '@angular/core';
// import { initializeApp, FirebaseApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase, ref, push, set, get, child, onValue, off } from 'firebase/database';
// import { firebaseConfig } from './environment';

// @Injectable({ providedIn: 'root' })
// export class FirebaseDbService {
//   private app: FirebaseApp;
//   private db = getDatabase(initializeApp(firebaseConfig));
//   private auth = getAuth(this.db.app);

//   constructor() {
//     // Caso queira conectar ao emulator durante dev:
//     // import { connectDatabaseEmulator } from "firebase/database";
//     // connectDatabaseEmulator(this.db, 'localhost', 9000);
//   }

//   // criar novo score (gera id automático)
//   async pushScore(score: { uid: string; displayName: string; floor: number; durationSec?: number; meta?: any }) {
//     const scoresRef = ref(this.db, 'scores');
//     const newRef = push(scoresRef);
//     await set(newRef, { ...score, createdAt: new Date().toISOString() });
//     return newRef.key;
//   }

//   // salvar save do usuário (saveId pode ser pushId ou algo seu)
//   async saveGame(uid: string, saveId: string, payload: any) {
//     const saveRef = ref(this.db, `users/${uid}/saves/${saveId}`);
//     await set(saveRef, { ...payload, updatedAt: new Date().toISOString() });
//   }

//   // ler leaderboard (top no nó leaderboards/top10)
//   async getLeaderboard() {
//     const snap = await get(ref(this.db, 'leaderboards/top10'));
//     return snap.exists() ? snap.val() : null;
//   }

//   // ouvir mudanças em scores (ex: para tela em tempo real)
//   listenScores(callback: (val: any) => void) {
//     const scoresRef = ref(this.db, 'scores');
//     onValue(scoresRef, snapshot => {
//       callback(snapshot.val());
//     });
//   }

//   // parar de ouvir (passar a mesma ref se necessário)
//   stopListeningScores() {
//     const scoresRef = ref(this.db, 'scores');
//     off(scoresRef);
//   }
// }