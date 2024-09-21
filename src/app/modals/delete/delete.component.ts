import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import data service
import { DataCenterService } from '../../service/data-center.service';
// import store
import { Store } from '@ngrx/store';
import { deleteBoard, deleteTask } from '../../../../store/store.actions';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  constructor(public dataService: DataCenterService, private store: Store) {}

  delete(): void {
    // deleting board
    if (this.dataService.deletingBoard) {
      this.deleteBoard(this.dataService.currentBoardId);
    }
    // deleting task
    else {
      this.deleteTask(
        this.dataService.currentBoardId,
        this.dataService.columName,
        this.dataService.task.title
      );
    }
    this.dataService.resetModal();
  }

  // delete board
  deleteBoard(boardId: string): void {
    this.store.dispatch(deleteBoard({ boardId }));
    this.dataService.toggleModal();
  }

  // delete task
  deleteTask(boardId: string, columnName: string, taskTitle: string): void {
    this.store.dispatch(deleteTask({ boardId, columnName, taskTitle }));
    this.dataService.toggleModal();
  }
}
