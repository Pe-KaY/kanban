import { createReducer, on } from '@ngrx/store';
import * as storeActions from '../store/store.actions';
import { KanbanState, Task } from '../interfaces/interfaces';

export const initialState: KanbanState = {
  boards: [],
};

export const kanbanReducer = createReducer(
  initialState,

  // fetch all boards
  on(storeActions.fetchBoardsSuccess, (state, { boards }) => ({
    ...state,
    boards: boards,
  })),

  // add board
  on(storeActions.addBoard, (state, { board }) => {
    const updatedBoards = [...state.boards, { ...board, isActive: false }];
    // Check if it's the only board, set isActive: true if so
    const boardsWithActiveStatus =
      updatedBoards.length === 1
        ? updatedBoards.map((b, index) => ({
            ...b,
            isActive: index === 0, // Set first board as active
          }))
        : updatedBoards;

    return {
      ...state,
      boards: boardsWithActiveStatus,
    };
  }),
  // update board
  on(storeActions.updateBoard, (state, { board }) => {
    const updatedBoards = state.boards.map((b) =>
      b.id === board.id ? { ...board } : b
    );
    return { ...state, boards: updatedBoards };
  }),

  // set active board
  on(storeActions.setActiveBoard, (state, { boardId }) => ({
    ...state,
    boards: state.boards.map((board) => {
      if (board.id === boardId) {
        return { ...board, isActive: true };
      } else {
        return { ...board, isActive: false };
      }
    }),
  })),

  // delete board
  on(storeActions.deleteBoard, (state, { boardId }) => {
    // Filter out the deleted board
    const updatedBoards = state.boards.filter((board) => board.id !== boardId);

    // If there are still boards left, set the first one to isActive: true
    const boardsWithActiveStatus =
      updatedBoards.length > 0
        ? updatedBoards.map((board, index) => ({
            ...board,
            isActive: index === 0, // Set first board as active, others inactive
          }))
        : [];

    return {
      ...state,
      boards: boardsWithActiveStatus,
    };
  }),

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

  //task and subtasks update
  on(storeActions.updateTask, (state, { boardId, columnName, task }) => {
    const updatedBoards = state.boards.map((board) => {
      if (board.id === boardId) {
        const updatedColumns = board.columns.map((column) => {
          // 1. If the column name matches and the status is unchanged, just update the task
          if (column.name === columnName && columnName === task.status) {
            const updatedTasks = column.tasks.map((t) =>
              t.title === task.title ? { ...task } : t
            );
            return { ...column, tasks: updatedTasks };
          }
          // 2. If the column name matches but the status has changed, remove the task from this column
          if (column.name === columnName && columnName !== task.status) {
            return {
              ...column,
              tasks: column.tasks.filter((t) => t.title !== task.title),
            };
          }
          // 3. Add the task to the new column based on the new status
          if (column.name === task.status && columnName !== task.status) {
            return {
              ...column,
              tasks: [...column.tasks, { ...task }], // Ensure the task is added with updated status
            };
          }
          return column;
        });
        return { ...board, columns: updatedColumns };
      }
      return board;
    });
    return { ...state, boards: updatedBoards };
  }),

  // delete task
  on(storeActions.deleteTask, (state, { boardId, columnName, taskTitle }) => {
    const updatedBoards = state.boards.map((board) => {
      if (board.id === boardId) {
        const updatedColumns = board.columns.map((column) => {
          if (column.name === columnName) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.title !== taskTitle),
            };
          }
          return column;
        });
        return { ...board, columns: updatedColumns };
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
