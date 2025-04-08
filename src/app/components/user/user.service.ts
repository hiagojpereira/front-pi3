


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  //urlBase = 'http://192.168.0.11:5000/users';

  urlBase = 'https://api-python-tcc.herokuapp.com/users';

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }
  
  create(user: User): Observable<User> {
    return this.http.post<User>(this.urlBase, user).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  read(): Observable<User[]> {
    return this.http.get<User[]>(this.urlBase).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  readByCod(cod_usuario: number): Observable<User> {
    const url = `${this.urlBase}/${cod_usuario}`
    return this.http.get<User>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  update(user: User): Observable<User> {
    console.log(user)
    const url = `${this.urlBase}/${user.cod_usuario}`
    console.log(url)
    return this.http.put<User>(url, user).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  delete(cod_usuario: number): Observable<User> {
    const url = `${this.urlBase}/${cod_usuario}`
    console.log(url)
    return this.http.delete<User>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    })
  }

  errorHandler(e: any): Observable<any> {
    console.log(e.error.erro)
    this.showMessage(e.error.erro, true)
    return EMPTY
  }
}