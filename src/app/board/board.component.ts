import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// import task component
import { TaskComponent } from '../task/task.component';
import { Column } from '../../../interfaces/interfaces';



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  
  @Input('column') column!: Column;
}
