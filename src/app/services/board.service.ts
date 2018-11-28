import { Injectable } from '@angular/core';
import { IShip, ShipDirection, ShipTypes } from '../../models/ship.model';
import { IBoard, IBoardItem } from '../../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  createBoard(size, ships): IBoard {
    const boardSchema: IBoardItem[][] = [];

    ships.map(ship => {
      ship.locations = this.setShipLocation(ship);
    });


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

    ships.forEach(ship => {
      ship.locations.forEach(location => {
        boardSchema[location.row][location.column] = {
          shipType: ship.type,
          occupied: true,
          crushed: false
        };
      });
    });

    return {
      schema: boardSchema,
      ships
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setShipLocation(ship: IShip) {
    const direction = this.getRandomInt(1, 2);
    const shipLocation = [];
    if (direction === ShipDirection.Horizontal) {
      const row = Math.floor(Math.random() * 10);
      const column = Math.floor(Math.random() * (10 - ship.width));

      for (let i = 0; i < ship.width; i++) {
        shipLocation.push({row, column: column + i});
      }
    } else {
      const row =  Math.floor(Math.random() * (10 - ship.width));
      const column = Math.floor(Math.random() * 10);

      for (let i = 0; i < ship.width; i++) {
        shipLocation.push({row: row + i, column});
      }
    }

    return shipLocation;
  }

  collision(locations, ships) {
    ships.forEach(ship => {
      locations.forEach(location => {
        console.log(ship.locations);
        if (ship.locations && ship.locations.find(loc => loc.row === location.row && loc.column === location.column)) {
          return true;
        } else {
          return true;
        }
      });
    });

    return false;
  }

  randomShot(boardSchema) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    console.log(randomRow, randomColumn);
    boardSchema[randomRow][randomColumn] = {...boardSchema[randomRow][randomColumn], crushed: true };
  }
}
