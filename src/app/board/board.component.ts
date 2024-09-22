import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// import task component
import { TaskComponent } from '../task/task.component';
import { Column } from '../../../interfaces/interfaces';
import { deleteTask, moveTask, updateTask } from '../../../store/store.actions';
import { Store } from '@ngrx/store';
import { DataCenterService } from '../service/data-center.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input('column') column!: Column;
  @Input() boardId!: string; // Input for board ID (from parent component)

  constructor(
    private store: Store,
    public dataCenterService: DataCenterService
  ) {}
  // Triggered when dragging starts
  onDragStart(
    event: DragEvent,
    taskTitle: string,
    sourceColumnName: string
  ): void {
    // Store the task title and source column in the drag event's dataTransfer object
    event.dataTransfer?.setData(
      'text/plain',
      JSON.stringify({ taskTitle, sourceColumnName })
    );
  }
  // Allow drop by preventing the default behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Triggered when a task is dropped
  onDrop(event: DragEvent): void {
    event.preventDefault();

    // Retrieve the task data from the event
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const { taskTitle, sourceColumnName } = JSON.parse(data);

      // Check if the task is being dragged from the same column
      if (sourceColumnName === this.column.name) return;
      // Dispatch the moveTask action to move the task between columns
      this.store.dispatch(
        updateTask({
          boardId: this.dataCenterService.currentBoardId,
          columnName: sourceColumnName,
          task: {
            ...this.dataCenterService.task,
            status: this.column.name,
          },
        })
      );
      // Delete task from previous column
      this.store.dispatch(
        deleteTask({
          boardId: this.dataCenterService.currentBoardId,
          columnName: sourceColumnName,
          taskTitle: taskTitle,
        })
      );
    }
  }
}
