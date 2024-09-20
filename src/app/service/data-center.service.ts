import { Injectable } from '@angular/core';
import * as actions from '../../../store/store.actions';
import { Store } from '@ngrx/store';
import { Board, Column, Task } from '../../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataCenterService {
  constructor(private store: Store) {}

  // darkMode
  isDarkMode = false;
  setDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  // modals
  modal = false;
  // modal types
  addEditBoard = false;
  addEditTask = false;
  editSubTask = false;
  confirmDelete = false;
  toggleModal() {
    this.modal = !this.modal;
  }
  resetModal() {
    this.addEditBoard = false;
    this.addEditTask = false;
    this.editSubTask = false;
    this.confirmDelete = false;
  }
  // individual modals
  addEditTaskModal() {
    this.resetModal();
    this.addEditTask = true;
    this.toggleModal();
  }
  // add edit board
  board!: Board;
  editBoard = false;
  createNewBoard() {
    this.editBoard = false;
    this.addEditBoardModal();
  }
  editactiveBoard() {
    this.editBoard = true;
    this.addEditBoardModal();
  }
  addEditBoardModal() {
    this.resetModal();
    this.addEditBoard = true;
    this.toggleModal();
  }
  // edit subtask
  task!: Task;
  columName!: string;
  currentBoardId!: string;
  boardColumns!: Column[];
  editSubTaskModal(task: Task, columName: string) {
    // set task and taskname
    this.task = task;
    this.columName = columName;

    // open modal
    this.resetModal();
    this.editSubTask = true;
    this.toggleModal();
  }
  confirmDeleteModal() {
    this.resetModal();
    this.confirmDelete = true;
    this.toggleModal();
  }

  // set active board
  setActiveBoard(boardId: string, boardTasks: Column[]) {
    this.store.dispatch(actions.setActiveBoard({ boardId }));
    // sets current board id and tasks
    this.currentBoardId = boardId;
    this.boardColumns = boardTasks;
  }

  // Id generator
  generateRandomId() {
    // Generate the first 3 letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomLetters = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');
    // Generate the next 4 digits
    const randomDigits = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    // Combine letters and digits
    return (randomLetters + randomDigits).toUpperCase();
  }
}
