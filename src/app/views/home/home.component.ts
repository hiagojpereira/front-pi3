import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../login/auth.service';

import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Sheet } from './sheet.model';
import { SheetService } from './sheet.service';

import * as moment from 'moment-timezone';
import { CommonModule } from '@angular/common';

const sheets: Sheet[] = []

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, HttpClientModule, MatButtonModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, CommonModule]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Sheet>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  authService = inject(AuthService);
  sheetService = inject(SheetService);

  displayedColumns: string[] = ['name', 'size', 'date', 'action'];
  dataSource = new MatTableDataSource<Sheet>([])
  
  srcResult: any
  fileName: any = ''

  items: any[]= [] 

  loading: boolean = false

  constructor(private router: Router, private http: HttpClient) { 
  }

  async ngOnInit(): Promise<void> {
    await this.buscarDados();
  }

  async buscarDados() {   
    this.loading = true
    this.dataSource.data = [];
    await this.sheetService.get_all().subscribe(result => {
      if (!result.error) {
        this.items = result.success
        this.items.forEach(item => {
          this.dataSource.data = [...this.dataSource.data, item];
          this.table.renderRows();
        })        
      }
      this.loading = false
    })
  }

  limparDadosInput() {
    this.fileName = ''
    this.fileInput.nativeElement.value = '';
  }
 
  formatarDataString(data: string) {
    let anoMesDia = (data.split('T')[0]).split('-')
    let horaMinSeg = ((data.split('T')[1]).split('-')[0]).split(':')
    return anoMesDia[2] + "/" + anoMesDia[1] + "/" + anoMesDia[0] + " " + horaMinSeg[0] + ":" + horaMinSeg[1] + ":" + horaMinSeg[2]
  }

  logout() {
    this.authService.logout();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openMap(sheet_id: any) {
    this.sheetService.get(sheet_id).subscribe(result => {
      if (!result.error) {
        let item = result['success']
        this.router.navigate(['/map'], {
          state: {
            item
          }
        });
      }
      else {
        this.sheetService.showMessage('Falha ao abrir o mapa', true)
      }
    })
  }


  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    const file = inputNode.files[0];
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });

        const fileData = {
          nome: file.name,
          tamanho: file.size,
          data: moment.tz(new Date(), 'America/Sao_Paulo').format(),
          dados: jsonData
        };

        this.fileName = file.name
        this.srcResult = fileData
        this.create()
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  create() {    
    this.loading = true
    this.sheetService.create(this.srcResult).subscribe(result => {
      if (!result.error) {
        this.limparDadosInput()          
        this.buscarDados()
      }
      else {
        this.sheetService.showMessage('Falha no upload', true)
      }
      
    this.loading = false
    })
  }

  delete(id_sheet: any) {
    this.sheetService.delete(id_sheet).subscribe(result => { 
      if (!result.error) {
        this.buscarDados()
      }
      else {
        this.sheetService.showMessage('Falha ao excluir', true)
      }
    })
  }
}
