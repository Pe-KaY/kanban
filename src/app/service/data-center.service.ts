import { Injectable } from '@angular/core';
import * as actions from '../../../store/store.actions';
import { Store } from '@ngrx/store';

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

  // modal
  modal = false;
  toggleModal() {
    this.modal = !this.modal;
  }

  // set active board
  setActiveBoard(boardname: string) {
    this.store.dispatch(actions.setActiveBoard({ boardname }));
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
