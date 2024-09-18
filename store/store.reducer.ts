import { createReducer, on } from '@ngrx/store';
import {
  addBoard,
  updateTask,
  fetchBoardsSuccess,
  setActiveBoard,
} from '../store/store.actions';
import { KanbanState } from '../interfaces/interfaces';

export const initialState: KanbanState = {
  boards: [],
};

export const kanbanReducer = createReducer(
  initialState,

  on(fetchBoardsSuccess, (state, { boards }) => ({
    ...state,
    boards: boards,
  })),

  on(addBoard, (state, { board }) => ({
    ...state,
    boards: [...state.boards, board],
  })),
  on(setActiveBoard, (state, { boardname }) => ({
    ...state,
    boards: state.boards.map((board) => {
      if (board.name === boardname) {
        return { ...board, isActive: true };
      } else {
        return { ...board, isActive: false };
      }
    }),
  }))
);
