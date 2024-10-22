import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rutina-detail',
  templateUrl: './rutina-detail.component.html',
  styleUrls: ['./rutina-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class RutinaDetailComponent implements OnInit {
  rutina!: Rutina;

  constructor(
    private route: ActivatedRoute,
    private rutinaService: RutinaService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getRutina();
  }

  getRutina(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(parseInt(id, 10))) {
      this.router.navigate(['rutinas']);
    } else {
      this.rutinaService.get(parseInt(id)).subscribe(dataPackage => {
        this.rutina = <Rutina>dataPackage.data;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
  
}
