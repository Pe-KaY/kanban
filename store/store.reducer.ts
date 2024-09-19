import { createReducer, on } from '@ngrx/store';
import * as storeActions from '../store/store.actions';
import { KanbanState, Task } from '../interfaces/interfaces';

export const initialState: KanbanState = {
  boards: [],
};

export const kanbanReducer = createReducer(
  initialState,

  on(storeActions.fetchBoardsSuccess, (state, { boards }) => ({
    ...state,
    boards: boards,
  })),

  on(storeActions.addBoard, (state, { board }) => ({
    ...state,
    boards: [...state.boards, board],
  })),
  on(storeActions.setActiveBoard, (state, { boardname }) => ({
    ...state,
    boards: state.boards.map((board) => {
      if (board.name === boardname) {
        return { ...board, isActive: true };
      } else {
        return { ...board, isActive: false };
      }
    }),
  })),
  //  add task
  on(storeActions.addTask, (state, { boardId, columnName, task }) => {
    // Find the target board
    const updatedBoards = state.boards.map((board) => {
      if (board.id === boardId) {
        // Find the target column
        const updatedColumns = board.columns.map((column) => {
          if (column.name === columnName) {
            return {
              ...column,
              tasks: [...column.tasks, task], // Add the new task to the column
            };
          }
          return column;
        });

        return {
          ...board,
          columns: updatedColumns,
        };
      }
      return board;
    });

    return { ...state, boards: updatedBoards };
  }),

  // drag and drop
  on(
    storeActions.moveTask,
    (state, { taskTitle, sourceColumnName, targetColumnName }) => {
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
    }
  )
);
