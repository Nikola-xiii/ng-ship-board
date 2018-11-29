import { Component, Input, OnInit } from '@angular/core';
import { IBoard } from '../../models/board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input()
  board: IBoard;
}
