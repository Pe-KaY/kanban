import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// import components
import { BoardNameComponent } from './board-name/board-name.component';
import { BoardComponent } from './board/board.component';
// import api service
import { ApiService } from './service/api/api.service';
import { fetchBoards } from '../../store/store.actions';
import { Board } from '../../interfaces/interfaces';
// import store
import { Store } from '@ngrx/store';
// import selectores
import {
  selectAllBoards,
  selectActiveBoards,
} from '../../store/store.selectors';
import { map, Observable } from 'rxjs';
// import data service
import { DataCenterService } from './service/data-center.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, BoardNameComponent, BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private apiService: ApiService,
    private store: Store,
    public dataCenterService: DataCenterService
  ) {}

  selectAllBoards$!: Observable<Board[]>;
  activeBoard$!: Observable<any>;

  ngOnInit() {
    this.store.dispatch(fetchBoards());
    this.selectAllBoards$ = this.store.select(selectAllBoards);
    this.activeBoard$ = this.store
      .select(selectActiveBoards)
      .pipe(map((boards) => boards[0]));
  }

  // hide sidebar
  hideBar = false;
  hideSidebar() {
    this.hideBar = !this.hideBar;
  }
}
