import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KanbanState, Board, Column } from '../interfaces/interfaces';


// Get the entire Kanban state
export const selectKanbanState = createFeatureSelector<KanbanState>('kanban');

// Get all boards
export const selectAllBoards = createSelector(
  selectKanbanState,
  (state: KanbanState) => state.boards
);


// Selector to get boards with isActive set to true
export const selectActiveBoards = createSelector(
  selectAllBoards,
  (boards: Board[]) => boards.filter(board => board.isActive)
);

// Get columns for a specific board
export const selectColumnsByBoard = createSelector(
  selectAllBoards,
  (boards: Board[], props: { boardId: string }) =>
    boards.find((board) => board.name === props.boardId)?.columns
);

// // Get tasks for a specific column in a board
// export const selectTasksByColumn = createSelector(
//   selectColumnsByBoard,
//   (columns: Column[] | undefined, props: { columnId: string }) =>
//     columns?.find(column => column.id === props.columnId)?.tasks
// );
