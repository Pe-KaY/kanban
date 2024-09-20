import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// import data service
import { DataCenterService } from '../../service/data-center.service';
// import store
import { Store } from '@ngrx/store';
import { Board } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-add-edit-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-edit-board.component.html',
  styleUrl: './add-edit-board.component.scss',
})
export class AddEditBoardComponent {
  constructor(
    private store: Store,
    private dataCenterService: DataCenterService
  ) {}

  // inputs

  
}
