import { Injectable } from '@angular/core';
import { IShip, ShipDirection, ShipTypes } from '../../models/ship.model';
import { IBoardItem } from '../../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  createBoard(size): IBoardItem[][] {
    const boardSchema: IBoardItem[][] = [];
    for (let i = 0; i < size; i++) {
      boardSchema[i] = [];
      for (let j = 0; j < size; j++) {
        boardSchema[i][j] = {
          shipType: null,
          occupied: false,
          crushed: false
        };
      }
    }

    return boardSchema;
  }

  addShip(boardSchema: IBoardItem[][], ship: IShip) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    switch (ship.width) {
      case 1:
        boardSchema[randomRow][randomColumn] = {
          shipType: ship.type,
          occupied: true,
          crushed: false
        };
        break;
      case 4:
        this.rotationShip(boardSchema, randomRow, randomColumn, ship);
        break;
      default:
        break;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rotationShip(boardSchema, randomRow, randomColumn, ship) {
    const randomDirection = this.getRandomInt(1, 4);
    let startLocation = {};
    let endLocation = {};
    switch (randomDirection) {
      case ShipDirection.Left:
        startLocation = {row: randomRow, column: randomColumn};
        endLocation = {row: randomRow, column: randomColumn + 3};
        break;
      case ShipDirection.Right:
        startLocation = {row: randomRow, column: randomColumn - 3};
        endLocation = {row: randomRow, column: randomColumn};
        break;
      case ShipDirection.Top:
        startLocation = {row: randomRow, column: randomColumn};
        endLocation = {row: randomRow + 3, column: randomColumn};
        break;
      case ShipDirection.Bottom:
        startLocation = {row: randomRow - 3, column: randomColumn};
        endLocation = {row: randomRow, column: randomColumn};
        break;
    }
    if (endLocation.row > 9 || startLocation.row < 0 || startLocation.column < 0 || endLocation.column > 9) {
      this.rotationShip(boardSchema, randomRow, randomColumn, ship);
    } else {
      this.buildShip(boardSchema, startLocation, endLocation, ship);
    }
  }

  buildShip(boardSchema, startLocation, endLocation, ship) {
    if (startLocation.row !== endLocation.row) {
      for (let i = startLocation.row; i <= endLocation.row; i++) {
        boardSchema[i][startLocation.column] = {
          shipType: ship.type,
          occupied: true,
          crushed: false
        };
      }
    } else if (startLocation.column !== endLocation.column) {
      for (let i = startLocation.column; i <= endLocation.column; i++) {
        boardSchema[startLocation.row][i] = {
          shipType: ship.type,
          occupied: true,
          crushed: false
        };
      }
    } else {
      boardSchema[startLocation.row][startLocation.column] = {
        shipType: ship.type,
        occupied: true,
        crushed: false
      };
    }
  }

  randomShot(boardSchema) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    console.log(randomRow, randomColumn);
    boardSchema[randomRow][randomColumn] = {...boardSchema[randomRow][randomColumn], crushed: true };
  }
}
