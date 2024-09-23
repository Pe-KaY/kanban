import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import form services
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
// import data service
import { DataCenterService } from '../../service/data-center.service';
import { Store } from '@ngrx/store';
import { Task } from '../../../../interfaces/interfaces';
import { updateTask } from '../../../../store/store.actions';

@Component({
  selector: 'app-sub-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sub-task.component.html',
  styleUrl: './sub-task.component.scss',
})
export class SubTaskComponent {
  constructor(
    public dataService: DataCenterService,
    private store: Store,
    private fb: FormBuilder
  ) {}

  taskForm!: FormGroup;
  totalSubtask!: number;
  completedSubtask!: number;

  ngOnInit() {
    // Calculate total subtasks
    this.totalSubtask = this.dataService.task.subtasks.length;
    // Calculate completed subtasks
    this.completedSubtask = this.dataService.task.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;

    this.taskForm = this.fb.group({
      status: [this.dataService.task, Validators.required], // Task status ('todo', 'doing', 'done')
      subtasks: this.fb.array([]), // Initialize form array for subtasks
    });

    // Populate the form array with the current subtasks
    this.populateSubtasks();
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // adds task subtask
  populateSubtasks(): void {
    this.dataService.task.subtasks.forEach((subtask) => {
      this.subtasks.push(
        this.fb.group({
          title: [subtask.title],
          isCompleted: [subtask.isCompleted],
        })
      );
    });
  }

  // update subtask in realtime
  updateSubtask() {
    const updatedTask: Task = {
      ...this.dataService.task,
      status: this.taskForm.value.status,
      subtasks: this.taskForm.value.subtasks, // Updated subtasks
    };
    // Calculate completed subtasks
    this.completedSubtask = updatedTask.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;
    // Dispatch action to update the task
    this.store.dispatch(
      updateTask({
        boardId: this.dataService.currentBoardId,
        columnName: this.dataService.columName,
        task: updatedTask,
      })
    );
  }

  // update subtask and status
  updateTask(): void {
    const updatedTask: Task = {
      ...this.dataService.task,
      status: this.taskForm.value.status,
      subtasks: this.taskForm.value.subtasks, // Updated subtasks
    };
    // Dispatch action to update the task
    this.store.dispatch(
      updateTask({
        boardId: this.dataService.currentBoardId,
        columnName: this.dataService.columName,
        task: updatedTask,
      })
    );
    // resets form
    this.taskForm.reset();
  }

  // Float Menu
  deleteTask() {
    this.dataService.editTaskMenu = false;
    this.dataService.deleteTask();
  }

  editTask() {
    this.dataService.editTaskMenu = false;
    this.dataService.editTask();
  }

  // updates subtask and status on destroy
  ngOnDestroy() {
    this.updateTask();
  }
}
