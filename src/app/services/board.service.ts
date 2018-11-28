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
    const locatedShips: IShip[] = [];

    ships.map(ship => {
      let locations = {};
      do {
        locations = this.setShipLocation(ship);
        console.log(this.collision(locations, ships));
      } while (this.collision(locations, ships));
      ship.locations = locations;
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
      ships: locatedShips
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
    const neighborLocations = [];
    locations.forEach(location => {
      neighborLocations.push({row: location.row - 1, column: location.column});
      neighborLocations.push({row: location.row + 1, column: location.column});
      neighborLocations.push({row: location.row, column: location.column - 1});
      neighborLocations.push({row: location.row, column: location.column + 1});
      neighborLocations.push({row: location.row - 1, column: location.column - 1});
      neighborLocations.push({row: location.row + 1, column: location.column + 1});
      neighborLocations.push({row: location.row + 1, column: location.column - 1});
      neighborLocations.push({row: location.row - 1, column: location.column + 1});
    });
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];

      for (let j = 0; j < locations.length; j++) {
        if (ship.locations && ship.locations.find(
          location => location.row === locations[j].row && location.column === locations[j].column)
        ) {
          return true;
        }
      }

      for (let j = 0; j < neighborLocations.length; j++) {
        if (ship.locations && ship.locations.find(
          location => location.row === neighborLocations[j].row && location.column === neighborLocations[j].column)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  randomShot(player, boardSchema: IBoardItem[][]) {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    if (boardSchema[randomRow][randomColumn].occupied) {
      player.points = player.points + 1;
    }
    boardSchema[randomRow][randomColumn] = {...boardSchema[randomRow][randomColumn], crushed: true };
  }
}
