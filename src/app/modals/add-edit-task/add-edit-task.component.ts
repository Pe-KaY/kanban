import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
// import interfaces
import { Column, Task } from '../../../../interfaces/interfaces';
// import data service
import { DataCenterService } from '../../service/data-center.service';
// import store
import { Store } from '@ngrx/store';
// import actions
import { addTask, updateTask } from '../../../../store/store.actions';

@Component({
  selector: 'app-add-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.scss',
})
export class AddEditTaskComponent {
  taskForm!: FormGroup;
  @Input('boardId') boardId!: string;
  @Input('columnNames') columnNames!: Column[];
  completedSubtasks!: number;

  columnName!: string;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dataCenterService: DataCenterService
  ) {}

  // inputs

  ngOnInit(): void {
    // Initialize the form for editing task
    if (this.dataCenterService.editingTask) {
      this.taskForm = this.fb.group({
        title: [this.dataCenterService.task?.title, Validators.required],
        description: [this.dataCenterService.task?.description],
        status: [this.dataCenterService.task?.status, Validators.required], // Default status if adding new
        subtasks: this.fb.array([]), // Initialize the form array for subtasks
      });
      // Populate the form array with the current task subtasks
      this.populateSubtasks();
    } else {
      // Initialize the form for new task
      this.taskForm = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        status: ['todo', Validators.required], // Default status, could be 'todo', 'in-progress', etc.
        subtasks: this.fb.array([]), // Initialize the form array for subtasks
      });
      // Optionally add a default subtask for new tasks
      this.addSubtask();
    }
  }

  // subtasks getter
  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // adds subtask to new forms
  addSubtask(): void {
    const subtaskGroup = this.fb.group({
      title: ['', Validators.required],
      isCompleted: [false],
    });
    this.subtasks.push(subtaskGroup);
  }
  // removes subtask
  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }
  // Populate subtasks for edit mode
  populateSubtasks(): void {
    if (this.dataCenterService.editingTask) {
      this.dataCenterService.task.subtasks.forEach((subtask) => {
        const subtaskGroup = this.fb.group({
          title: [subtask.title, Validators.required],
          isCompleted: [subtask.isCompleted],
        });
        this.subtasks.push(subtaskGroup);
      });
    }
  }

  // Handle adding or updating the task
  addEditTask(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      const originalColumn = this.dataCenterService.columName;
      this.columnName = this.taskForm.get('status')?.value;
      if (this.dataCenterService.editingTask) {
        // Dispatch updateTask action if editing
        this.store.dispatch(
          updateTask({
            boardId: this.boardId,
            columnName: originalColumn,
            task: task,
          })
        );
      } else {
        // Dispatch addTask action if adding
        this.store.dispatch(
          addTask({
            boardId: this.boardId,
            columnName: this.columnName,
            task: task,
          })
        );
      }

      // reset editing state
      this.dataCenterService.editingTask = false;

      // Clear the form
      this.taskForm.reset();
      // Hide the modal
      this.dataCenterService.toggleModal();
    }
  }
}
