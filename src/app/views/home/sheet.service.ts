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
      return this.http.delete<Sheet>(url).pipe(
          map(obj => obj),
          catchError(e => this.errorHandler(e))
      )
  }

  get(sheet_id: string): Observable<{success: any, error: any}> {
    const url = `${this.urlBase}/get/${sheet_id}`
    return this.http.get<Sheet>(url).pipe(
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
    this.showMessage(e.error.erro, true)
    return EMPTY
  }

}
