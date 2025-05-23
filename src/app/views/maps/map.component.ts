import { JsonPipe, NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { MatCardModule } from '@angular/material/card';

import { Sheet } from '../home/sheet.model';
import { SheetService } from '../home/sheet.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import moment from 'moment';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [GoogleMapsModule, NgForOf, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule, MatLabel, MatInputModule]
})
export class MapComponent {
  
  sheetService = inject(SheetService);

  selectedSexo: string = 'Ambos';
  lista_sexo: string[] = ['Ambos', 'Masculino', 'Feminino'];

  lista_bairros: string[] = []

  private readonly _formBuilder = inject(FormBuilder);

  bairros = this._formBuilder.group({
    masculino: false,
    feminino: false,
  });
  
  center: google.maps.LatLngLiteral = { lat: -21.1434, lng: -48.007 };
  markerLatLong: google.maps.LatLngLiteral[] = []

  planilha: Sheet
  dados_filtrados: any[]

  nomeArquivo = ''
  tamanhoArquivo = ''
  dataUpload = ''

  filtro = {
    sexo: '',
    idade: '',
    bairro: ''
  }

  idadeMinima = '';
  idadeMaxima = '';

  constructor(private router: Router) { 
    this.planilha = history.state.item
    this.dados_filtrados = [... this.planilha.dados]
    this.mostrarDados()
    this.montarListaBairros()
    this.infoCards = [
      { label: 'Arquivo:', value: this.planilha.nome },
      { label: 'Tamanho (Bytes):', value: this.planilha.tamanho },
      { label: 'Data upload:', value: this.formatarDataString(this.planilha.data) },
      { label: 'Nº casos:', value: this.planilha.dados.length }
    ];
  }

  infoCards: any[] = [];

  montarListaBairros() {
    this.planilha.dados.forEach(x => {
      if (this.lista_bairros.findIndex(y => y == x['NM_BAIRRO']) == -1) {
        this.lista_bairros.push(x['NM_BAIRRO'])
      }
    })
  }

  getLen(list: any[]) {
    return list.length
  }

  mostrarDados() {
    this.markerLatLong = []
    if (this.dados_filtrados.length > 0) {
      this.dados_filtrados.forEach(dado=> {
        this.markerLatLong.push({
          lat: Number(dado['lat']),
          lng: Number(dado['lng'])
        })
      });
    }
  }

  selectedBairros: string[] = [];

  toggleSelection(value: string): void {
    const index = this.selectedBairros.indexOf(value);
    if (index === -1) {
      this.selectedBairros.push(value);
    } else {
      this.selectedBairros.splice(index, 1);
    }
    this.filtrar()
  }

  isSelected(value: string): boolean {
    return this.selectedBairros.includes(value);
  }

  filtrar() {    
    this.filtroSexo()
    this.filtroBairro()
    this.filtrarPorIdade()
    this.mostrarDados()
  }


  filtroSexo() {
    if (this.selectedSexo == "Ambos") {
      this.dados_filtrados = [... this.planilha.dados]
    }
    else if (this.selectedSexo == "Masculino") {
      this.dados_filtrados = [... this.planilha.dados.filter(x => x['CS_SEXO'] == 'M')]
    }
    else if (this.selectedSexo == "Feminino") {
      this.dados_filtrados = [... this.planilha.dados.filter(x => x['CS_SEXO'] == 'F')]
    }
  }

  filtroBairro() {
    if (this.selectedBairros.length > 0) {
      this.dados_filtrados = this.dados_filtrados.filter(item => this.selectedBairros.includes(item['NM_BAIRRO']));
    }
  }

  filtrarPorIdade() {
    if (!!this.idadeMinima && !!this.idadeMaxima) {
        this.dados_filtrados = this.dados_filtrados.filter(item => { 
          const nascimento = moment(item['DT_NASC'], 'YYYY-MM-DD');
          const hoje = moment();
          const idade = hoje.diff(nascimento, 'years');
          return idade >= Number(this.idadeMinima) && idade <= Number(this.idadeMaxima)
        })
    }
    else if (!!this.idadeMinima) {
        this.dados_filtrados = this.dados_filtrados.filter(item => { 
          const nascimento = moment(item['DT_NASC'], 'YYYY-MM-DD');
          const hoje = moment();
          const idade = hoje.diff(nascimento, 'years');
          return idade >= Number(this.idadeMinima)
        })
    }
    else if (!!this.idadeMaxima) {
        this.dados_filtrados = this.dados_filtrados.filter(item => { 
          const nascimento = moment(item['DT_NASC'], 'YYYY-MM-DD');
          const hoje = moment();
          const idade = hoje.diff(nascimento, 'years');
          return idade <= Number(this.idadeMaxima)
        })
    }
  }
  
  onlyNumber(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }

  formatarDataString(data: string) {
    let anoMesDia = (data.split('T')[0]).split('-')
    return anoMesDia[2] + "/" + anoMesDia[1] + "/" + anoMesDia[0] 
  }

}
