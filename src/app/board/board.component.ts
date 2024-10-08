import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// import task component
import { TaskComponent } from '../task/task.component';
import { Column } from '../../../interfaces/interfaces';
import { deleteTask, updateTask } from '../../../store/store.actions';
import { Store } from '@ngrx/store';
import { DataCenterService } from '../service/data-center.service';
import { log } from 'node:util';

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
  @Input('index') index!: number;

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

      console.log('working');

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

  // circle colors
  circleColor(status: string): string {
    switch (status) {
      case '0':
        return '#49C4E5';
      case '1':
        return '#8471F2';
      case '2':
        return '#67E2AE';
      default:
        return this.getRandomHexColor();
    }
  }

  // random colors
  getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0').toUpperCase()}`;
  }
}
