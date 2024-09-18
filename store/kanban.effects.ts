// kanban.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ApiService } from '../src/app/service/api/api.service';
import {
  fetchBoards,
  fetchBoardsSuccess,
  fetchBoardsFailure,
} from '../store/store.actions';
import { Board } from '../interfaces/interfaces';

@Injectable()
export class KanbanEffects {
  constructor(
    private actions$: Actions,
    private kanbanService: ApiService // Service to fetch data
  ) {}

  // Effect to handle fetching boards from API
  fetchBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBoards), // Listen for the fetchBoards action
      mergeMap(() =>
        this.kanbanService.getBoards().pipe(
          // Make the API
          map((board: any) => {
            const boards = board.boards;
            return fetchBoardsSuccess({ boards });
          }), // Dispatch success action
          catchError((error) => of(fetchBoardsFailure({ error }))) // Handle error
        )
      )
    )
  );
}
