import { Component } from '@angular/core';
import { VehicleList } from './vehicle-list/vehicle-list';

@Component({
  imports: [VehicleList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
