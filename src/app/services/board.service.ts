import { Injectable } from '@angular/core';
import { IShip } from '../../models/ship.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  createBoard(size): string[][] {
    const boardSchema: string[][] = [];
    for (let i = 0; i < size; i++) {
      boardSchema[i] = [];
      for (let j = 0; j < size; j++) {
        boardSchema[i][j] = '';
      }
    }

    return boardSchema;
  }

  addShip(boardSchema: string[][], ship: IShip) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    if (!boardSchema[randomRow][randomColumn] && ship.width === 1) {
      boardSchema[randomRow][randomColumn] = ship.type;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomShot(boardSchema) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);

    switch (boardSchema[randomRow][randomColumn]) {
      case '':
        boardSchema[randomRow][randomColumn] = 'x';
        break;
      case 'Ship Dot':
        boardSchema[randomRow][randomColumn] = 'kill Ship Dot';
        break;
      default:
        this.randomShot(boardSchema);
        break;
    }
  }
}
