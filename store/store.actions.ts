import { createAction, props } from '@ngrx/store';
import { Board, Task } from '../interfaces/interfaces';

// EFFECTS ACTIONS
// Fetch boards from the API
export const fetchBoards = createAction('[Kanban] Fetch Boards');

// When boards are successfully fetched
export const fetchBoardsSuccess = createAction(
  '[Kanban] Fetch Boards Success',
  props<{ boards: Board[] }>()
);

// If fetching boards fails
export const fetchBoardsFailure = createAction(
  '[Kanban] Fetch Boards Failure',
  props<{ error: any }>()
);

// MANIPULATION ACTIONS
// add board
export const addBoard = createAction(
  '[Kanban] Add Board',
  props<{ board: Board }>()
);

// active board
export const setActiveBoard = createAction(
  '[Kanban] Set Active Board',
  props<{ boardname: string }>()
);

// Update task
export const updateTask = createAction(
  '[Kanban] Update Task',
  props<{
    boardId: string;
    columnId: string;
    taskId: string;
    updatedTask: Task;
  }>()
);

// drag and drop
export const moveTask = createAction(
  '[Kanban] Move Task',
  props<{
    taskTitle: string;
    sourceColumnName: string;
    targetColumnName: string;
  }>()
);
