import { Component, Input } from '@angular/core';
import { Column, Task } from '../../../interfaces/interfaces';
// import data service
import { DataCenterService } from '../service/data-center.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(public dataCenterService: DataCenterService) {}

  @Input('task') task!: Task;
  @Input('columName') columName!: string;
  completedTasks!: number;

  ngOnInit(): void {
    this.completedTasks = this.task.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;
  }
}
