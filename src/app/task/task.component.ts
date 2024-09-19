import { Component, Input } from '@angular/core';
import { Task } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input('task') task!: Task;
  completedTasks!: number;

  ngOnInit(): void {
    this.completedTasks = this.task.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;
  }
}
