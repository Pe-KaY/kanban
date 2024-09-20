import { Component, Input } from '@angular/core';
// import data service
import { DataCenterService } from '../service/data-center.service';
import { Board, Column, Task } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-board-name',
  standalone: true,
  imports: [],
  templateUrl: './board-name.component.html',
  styleUrl: './board-name.component.scss',
})
export class BoardNameComponent {
  constructor(private dataCenterService: DataCenterService) {}

  @Input('boardname') boardname!: string;
  @Input('board') board!: Board
  

  // set active board
  setActiveBoard(boardname: string, boardTasks: Column[]) {
    this.dataCenterService.setActiveBoard(boardname,boardTasks);
  }
}
