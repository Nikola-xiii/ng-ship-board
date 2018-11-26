import { Component } from '@angular/core';
import { BoardService } from './services/board.service';
import { IBoard } from '../models/board.model';
import { ShipTypes } from '../models/ship.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ship Board Game';
  board: IBoard;

  constructor(private boardService: BoardService) {
    this.board = {
      schema: boardService.createBoard(10),
      ship: 4
    };

    this.boardService.addShip(this.board.schema, {
      type: ShipTypes.D,
      width: 1
    });

    this.boardService.addShip(this.board.schema, {
      type: ShipTypes.D,
      width: 1
    });
  }

  playerShot() {
    this.boardService.randomShot(this.board.schema);
  }
}
