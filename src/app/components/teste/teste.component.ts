import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../components/template/header/header.service';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.scss'],
  imports: [MatCardModule]
})
export class TesteComponent implements OnInit {

  // constructor(private headerService: HeaderService) { 
  //   headerService.headerData = {
  //     title: 'Início',
  //     icon: 'home',
  //     routeUrl: '/'
  //   }
  // }

  ngOnInit(): void {
  }

}
