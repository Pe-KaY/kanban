import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../../../../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>('../../../assets/data.json');
  }
}
