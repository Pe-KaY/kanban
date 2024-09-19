import { createReducer, on } from '@ngrx/store';
import {
  addBoard,
  updateTask,
  fetchBoardsSuccess,
  moveTask,
  setActiveBoard,
} from '../store/store.actions';
import { KanbanState, Task } from '../interfaces/interfaces';

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
  })),

  // drag and drop
  on(moveTask, (state, { taskTitle, sourceColumnName, targetColumnName }) => {
    let taskToMove: Task | undefined;

    const updatedBoards = state.boards.map((board) => {
      const updatedColumns = board.columns.map((column) => {
        if (column.name === sourceColumnName) {
          // Find and remove the task from the source column
          const tasksToRemove = column.tasks.filter(
            (task) => task.title === taskTitle
          );
          if (tasksToRemove.length > 0) {
            taskToMove = tasksToRemove[0];
          }
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.title !== taskTitle),
          };
        }

        if (column.name === targetColumnName) {
          if (taskToMove) {
            // Add the task to the target column
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  ...taskToMove,
                  status: targetColumnName,
                },
              ],
            };
          }
        }

        return column;
      });

      return { ...board, columns: updatedColumns };
    });

    return { ...state, boards: updatedBoards };
  })
);
