import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Sheet } from './sheet.model';


@Injectable({
  providedIn: 'root'
})
export class SheetService {

    urlBase = 'http://127.0.0.1:5000/sheet';

//   urlBase = 'https://api-python-tcc.herokuapp.com/users';

// result = {success: '', error: ''}

    constructor(
        private snackBar: MatSnackBar,
        private http: HttpClient
    ) { }
    
    create(sheet: Sheet): Observable<{success: any, error: any}> {
        return this.http.post<Sheet>(`${this.urlBase}/add`, sheet).pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e))
        )
    }

    get_all(): Observable<{success: any, error: any}> {
        return this.http.get<Sheet[]>(`${this.urlBase}/get_all`).pipe(
            map(obj => obj),
            catchError(e => {
                return this.errorHandler(e)
            })
        )
    }

    delete(id_sheet: string): Observable<{success: any, error: any}> {
        const url = `${this.urlBase}/delete/${id_sheet}`
        console.log(url)
        return this.http.delete<Sheet>(url).pipe(
            map(obj => obj),
            catchError(e => this.errorHandler(e))
        )
    }

//   private apiKey = 'SUA_CHAVE_DE_API_AQUI';
//   private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

//   getCoordinates(address: string): Observable<any> {
//     const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
//     return this.http.get(url);
//   }

  get(sheet_id: string): Observable<{success: any, error: any}> {
    const url = `${this.urlBase}/get/${sheet_id}`
    return this.http.get<Sheet>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

//   update(user: User): Observable<User> {
//     console.log(user)
//     const url = `${this.urlBase}/${user.cod_usuario}`
//     console.log(url)
//     return this.http.put<User>(url, user).pipe(
//       map(obj => obj),
//       catchError(e => this.errorHandler(e))
//     )
//   }

//   delete(cod_usuario: number): Observable<User> {
//     const url = `${this.urlBase}/${cod_usuario}`
//     console.log(url)
//     return this.http.delete<User>(url).pipe(
//       map(obj => obj),
//       catchError(e => this.errorHandler(e))
//     )
//   }

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
