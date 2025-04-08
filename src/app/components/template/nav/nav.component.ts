import { Component, OnInit } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [RouterModule, MatSidenavModule, MatSidenavModule, MatNavList]
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
