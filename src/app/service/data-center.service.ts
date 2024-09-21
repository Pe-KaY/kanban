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

  //  toggles edit delete task/board float menu
  editBoardMenu = false;
  editTaskMenu = false;
  toggleBoardMenu() {
    this.editBoardMenu = !this.editBoardMenu;
  }
  toggleTaskMenu() {
    this.editTaskMenu = !this.editTaskMenu;
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
  // add edit task
  editingTask = false;
  editTask() {
    this.editingTask = true;
    this.editSubTask = false;
    this.addEditTask = true;
  }
  addingTask() {
    this.editingTask = false;
    this.addEditTaskModal();
  }
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
  // confirm delete modal
  deletingBoard = false;
  deletingTask = false;
  deleteBoard() {
    this.deletingBoard = true;
    this.deletingTask = false;
    this.confirmDeleteModal();
    this.modal = true;
  }
  deleteTask() {
    this.deletingTask = true;
    this.deletingBoard = false;
    this.confirmDeleteModal();
  }
  confirmDeleteModal() {
    this.resetModal();
    this.confirmDelete = true;
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
