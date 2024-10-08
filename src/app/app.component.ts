import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// import components
import { BoardNameComponent } from './board-name/board-name.component';
import { BoardComponent } from './board/board.component';
import { AddEditTaskComponent } from './modals/add-edit-task/add-edit-task.component';
// import actions
import { fetchBoards } from '../../store/store.actions';
import { Board } from '../../interfaces/interfaces';
// import store
import { Store } from '@ngrx/store';
// import selectores
import {
  selectAllBoards,
  selectActiveBoards,
} from '../../store/store.selectors';
import { map, Observable, tap } from 'rxjs';
// import data service
import { DataCenterService } from './service/data-center.service';
import { AddEditBoardComponent } from './modals/add-edit-board/add-edit-board.component';
import { SubTaskComponent } from './modals/sub-task/sub-task.component';
import { DeleteComponent } from './modals/delete/delete.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    BoardNameComponent,
    BoardComponent,
    AddEditTaskComponent,
    AddEditBoardComponent,
    SubTaskComponent,
    DeleteComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    // private apiService: ApiService,
    private store: Store,
    public dataCenterService: DataCenterService
  ) {}

  // query template
  @ViewChild('modal') modal!: ElementRef;

  selectAllBoards$!: Observable<Board[]>;
  activeBoard$!: Observable<any>;
  boardColumns: string[] = [];

  ngOnInit() {
    this.store.dispatch(fetchBoards());
    this.selectAllBoards$ = this.store.select(selectAllBoards);
    this.activeBoard$ = this.store.select(selectActiveBoards).pipe(
      map((boards) => boards[0]),
      // sets active board id and tasks in the service on inititalize
      tap((board) => (this.dataCenterService.currentBoardId = board.id)),
      tap((board) => (this.dataCenterService.boardColumns = board.columns)),
      tap((board) => (this.dataCenterService.board = board))
    );
  }

  ngAfterViewInit() {
    this.modal.nativeElement.addEventListener('click', (event: Event) => {
      // close modal on outside click
      if (event.target === this.modal.nativeElement) {
        // wont close confirm delete modal
        if (this.dataCenterService.confirmDelete) return;
        // close modal
        this.dataCenterService.toggleModal();
        this.dataCenterService.resetModal();
        this.dataCenterService.editingTask = false;
      }
    });
  }
  // hide sidebar
  hideBar = false;
  hideSidebar() {
    this.hideBar = !this.hideBar;
  }

  // toggle mobile menu
  mobileMenu = false;
  toggleMobileMenu() {
    this.hideSidebar();
    this.mobileMenu = !this.mobileMenu;
  }

  // editboard
  editBoard() {
    this.dataCenterService.editBoardMenu = false;
    this.dataCenterService.editactiveBoard();
  }

  // deleteboard
  deleteBoard() {
    this.dataCenterService.editBoardMenu = false;
    this.dataCenterService.deleteBoard();
  }
}
