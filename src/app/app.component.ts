import { Component } from '@angular/core';
import { BoardService } from './services/board.service';
import { IBoard } from '../models/board.model';
import { IShip, ShipTypes } from '../models/ship.model';
import { IPlayer } from '../models/player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ship Board Game';
  ships: IShip[] = [
    {
      id: 1,
      type: ShipTypes.L,
      width: 4,
      locations: []
    },
    {
      id: 2,
      type: ShipTypes.I,
      width: 4,
      locations: []
    },
    {
      id: 3,
      type: ShipTypes.D,
      width: 1,
      locations: []
    },
    {
      id: 4,
      type: ShipTypes.D,
      width: 1,
      locations: []
    },
  ];
  player1: IPlayer = {
    name: 'User 1',
    shots: 0,
    points: 0,
  };
  player2: IPlayer = {
    name: 'User 2',
    shots: 0,
    points: 0,
  };
  board: IBoard;

  constructor(private boardService: BoardService) {
    this.board = boardService.createBoard(10, this.ships);
  }

  playerShot(player) {
    console.log(player);
    player.shots = player.shots + 1;
    this.boardService.randomShot(player, this.board);
  }
}
