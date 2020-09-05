import { AuthService } from './../../services/auth.service';
import { PrincipalService } from './../../services/principal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-logada',
  templateUrl: './area-logada.component.html',
  styleUrls: ['./area-logada.component.css'],
})
export class AreaLogadaComponent implements OnInit {
  constructor(private pricipal: PrincipalService, private auth: AuthService) {
    this.pricipal.getPrincipal().subscribe();
    this.auth.isAuthenticated().subscribe();
    this.auth.getUser().subscribe();
  }

  ngOnInit(): void {}
}
