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

  // set darkMode
  setDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  

  // set active board
  setActiveBoard(boardname: string) {
    this.store.dispatch(actions.setActiveBoard({ boardname }));
  }
}
