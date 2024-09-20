import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// import data service
import { DataCenterService } from '../../service/data-center.service';
// import store
import { Store } from '@ngrx/store';
import { addBoard, updateBoard } from '../../../../store/store.actions';

@Component({
  selector: 'app-add-edit-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-board.component.html',
  styleUrl: './add-edit-board.component.scss',
})
export class AddEditBoardComponent {
  constructor(
    private store: Store,
    public dataCenterService: DataCenterService,
    private fb: FormBuilder
  ) {}

  boardForm!: FormGroup;

  ngOnInit(): void {
    // Determine if it's edit mode based on the input
    if (this.dataCenterService.editBoard) {
      this.boardForm = this.fb.group({
        name: [this.dataCenterService.board?.name || '', Validators.required],
        isActive: [
          this.dataCenterService.board?.isActive || false,
          Validators.required,
        ],
        columns: this.fb.array(
          this.dataCenterService.board?.columns.map((column) =>
            this.fb.group({
              name: [column.name, Validators.required],
              tasks: [column.tasks || []], // Keep tasks even if we won't edit them here
            })
          ) || [] // Empty for new boards
        ),
      });
    } else {
      this.boardForm = this.fb.group({
        name: ['', Validators.required],
        isActive: [false, Validators.required],
        columns: this.fb.array([]),
      });
    }
  }

  // Getter for columns FormArray
  get columns(): FormArray {
    return this.boardForm.get('columns') as FormArray;
  }

  // Add new column
  addColumn(): void {
    const columnGroup = this.fb.group({
      name: ['', Validators.required],
      tasks: this.fb.array([]), // Initially empty
    });
    this.columns.push(columnGroup);
  }

  // Remove a column
  removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  // Handle form submission
  onSubmit(): void {
    if (this.boardForm.valid) {
      const newBoard = {
        ...this.boardForm.value,
        id: this.dataCenterService.editBoard
          ? this.dataCenterService.board.id
          : this.dataCenterService.generateRandomId(), // Generate a new ID if it's a new board
        columns: this.boardForm.value.columns.map((column: any) => ({
          ...column,
          tasks: column.tasks || [], // Ensure tasks are intact
        })),
      };

      if (this.dataCenterService.editBoard) {
        // Dispatch action to update board
        this.store.dispatch(updateBoard({ board: newBoard }));
      } else {
        // Dispatch action to add a new board
        this.store.dispatch(addBoard({ board: newBoard }));
      }
    }
  }
}
