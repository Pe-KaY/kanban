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
// update board
export const updateBoard = createAction(
  '[Kanban] Update Board',
  props<{ board: Board }>()
);

// active board
export const setActiveBoard = createAction(
  '[Kanban] Set Active Board',
  props<{ boardId: string }>()
);

// delete board
export const deleteBoard = createAction(
  '[Board] Delete Board',
  props<{ boardId: string }>()
);

// add task
export const addTask = createAction(
  '[Kanban] Add Task',
  props<{
    boardId: string;
    columnName: string;
    task: Task;
  }>()
);

// Update task
export const updateTask = createAction(
  '[Kanban] Update Task or subTask',
  props<{ boardId: string; columnName: string; task: Task }>()
);

// Delete task
export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ boardId: string; columnName: string; taskTitle: string }>()
);

// drag and drop
export const moveTask = createAction(
  '[Task] Move Task',
  props<{ taskTitle: string; sourceColumnName: string; targetColumnName: string }>()
);
