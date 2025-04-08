import { NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { MatCardModule } from '@angular/material/card';

import * as L from 'leaflet';
import { Sheet } from '../home/sheet.model';
import { SheetService } from '../home/sheet.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [GoogleMapsModule, NgForOf, MatCardModule, MatButtonModule]
})
export class MapComponent {
  
  sheetService = inject(SheetService);
  
  center: google.maps.LatLngLiteral = { lat: -21.1434, lng: -48.007 };
  markerLatLong: google.maps.LatLngLiteral[] = []

  planilha: Sheet

  nomeArquivo = ''
  tamanhoArquivo = ''
  dataUpload = ''

  constructor(private router: Router) { 
    this.planilha = history.state.item
    if (this.planilha.dados.length > 0) {
      this.planilha.dados.forEach(dado=> {
        this.markerLatLong.push({
          lat: dado['lat'],
          lng: dado['lng']
        })
      });
    }
    else {
      this.sheetService.showMessage('Planilha não contém dados de localização!', true)
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }

  formatarDataString(data: string) {
    let anoMesDia = (data.split('T')[0]).split('-')
    let horaMinSeg = ((data.split('T')[1]).split('-')[0]).split(':')
    return anoMesDia[2] + "/" + anoMesDia[1] + "/" + anoMesDia[0] 
    // return anoMesDia[2] + "/" + anoMesDia[1] + "/" + anoMesDia[0] + " " + horaMinSeg[0] + ":" + horaMinSeg[1] + ":" + horaMinSeg[2]
  }

}
