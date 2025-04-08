import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, updateProfile, user } from "@angular/fire/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { from, Observable } from "rxjs";
import { UserInterface } from "./user.interface";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null | undefined>(undefined);
    
    constructor(
        private snackBar: MatSnackBar
    ) { }

    register(
        email: string, 
        username: string, 
        password: string
    ): Observable<void> {
        const promise = createUserWithEmailAndPassword(
            this.firebaseAuth, 
            email, 
            password
        ).then(response => updateProfile(response.user, {displayName: username}));

        return from(promise);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(() => {
            this.showMessage('Login realizado com sucesso!')
        });

        return from(promise);
    }

    logout() : Observable<void> {
        const promise = signOut(this.firebaseAuth);
        return from(promise);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('userToken'); // Verifica se há um token salvo
    }

    showMessage(msg: string, isError: boolean = false): void {
        this.snackBar.open(msg, 'X', {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: isError ? ['msg-error'] : ['msg-success']
        })
    }
}