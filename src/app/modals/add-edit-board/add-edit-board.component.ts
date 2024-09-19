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
import { addTask } from '../../../../store/store.actions';

@Component({
  selector: 'app-add-edit-board',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-board.component.html',
  styleUrl: './add-edit-board.component.scss',
})
export class AddEditBoardComponent {
  taskForm!: FormGroup;
  @Input('boardId') boardId!: string;
  @Input('columnNames') columnNames!: Column[];
  completedSubtasks!: number;

  columnName!: string;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dataCenterService: DataCenterService
  ) {}

  // inputs

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['todo', Validators.required], // Default status, could be 'todo', 'in-progress', etc.
      subtasks: this.fb.array([]), // Initialize the form array for subtasks
    });

    // Optionally add a default subtask on init
    this.addSubtask();
    // calculates completed subtasks
    
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // add task to the form array
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

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;

      this.columnName = this.taskForm.get('status')?.value;
      // Dispatch the addTask action with boardId, columnName, and newTask
      this.store.dispatch(
        addTask({
          boardId: this.boardId,
          columnName: this.columnName,
          task: newTask,
        })
      );
      console.log(this.taskForm.value);
      // Clear the form
      this.taskForm.reset();
      // hide the modal
      this.dataCenterService.toggleModal();
    }
  }
}
