import { Component } from '@angular/core';
import { BoardService } from './services/board.service';
import { IBoard } from '../models/board.model';
import { IShip, ShipTypes } from '../models/ship.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ship Board Game';
  ships: Partial<IShip>[] = [
    {
      type: ShipTypes.L,
      width: 4
    },
    {
      type: ShipTypes.I,
      width: 4
    },
    {
      type: ShipTypes.D,
      width: 1
    },
    {
      type: ShipTypes.D,
      width: 1
    },
  ];
  board: IBoard;

  constructor(private boardService: BoardService) {
    this.board = boardService.createBoard(10, this.ships);
  }

  playerShot() {
    this.boardService.randomShot(this.board.schema);
  }
}
