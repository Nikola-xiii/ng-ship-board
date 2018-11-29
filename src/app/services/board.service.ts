import { Injectable } from '@angular/core';
import { ILocation, IShip, ShipDirection } from '../../models/ship.model';
import { IBoard, IBoardItem } from '../../models/board.model';
import { IPlayer } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  createBoard(size: number, ships: IShip[]): IBoard {
    const boardSchema: IBoardItem[][] = this.buildEmptyBoard(size);
    this.buildShips(ships, boardSchema);

    return {
      schema: boardSchema,
      ships
    };
  }

  private buildEmptyBoard(size: number): IBoardItem[][] {
    const boardSchema = [];

    for (let i = 0; i < size; i++) {
      boardSchema[i] = [];
      for (let j = 0; j < size; j++) {
        boardSchema[i][j] = {
          shipType: null,
          shipId: null,
          occupied: false,
          crushed: false
        };
      }
    }

    return boardSchema;
  }

  private buildShips(ships: IShip[], boardSchema: IBoardItem[][]) {
    ships.map(ship => {
      let locations = {};
      do {
        locations = this.setShipLocation(ship);
        console.log(this.collision(locations, ships));
      } while (this.collision(locations, ships));
      ship.locations = locations;
    });

    ships.forEach(ship => {
      ship.locations.forEach(location => {
        boardSchema[location.row][location.column] = {
          shipType: ship.type,
          occupied: true,
          crushed: false,
          shipId: ship.id
        };
      });
    });
  }

  private setShipLocation(ship: IShip): ILocation[] {
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

  private collision(locations: ILocation[], ships: IShip[]): boolean {
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

  public randomShot(player: IPlayer, board: IBoard): void {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);
    if (board.schema[randomRow][randomColumn].occupied) {
      const _shipId = board.schema[randomRow][randomColumn].shipId;
      player.points = player.points + 1;
      const crushedShip = board.ships.find(ship => ship.id === _shipId);
      crushedShip.locations = crushedShip.locations.filter(location => !(location.row === randomRow && location.column === randomColumn));
      if (crushedShip.locations.length === 0) {
        board.ships = board.ships.filter(ship => ship.id !== _shipId);
      }
      board.schema[randomRow][randomColumn].occupied = false;
    }
    if (board.schema[randomRow][randomColumn].crushed) {
      this.randomShot(player, board);
    }
    board.schema[randomRow][randomColumn] = {...board.schema[randomRow][randomColumn], crushed: true };
    console.log(board.ships);
  }

  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
