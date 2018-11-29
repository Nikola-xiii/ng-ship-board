import { Injectable } from '@angular/core';
import { ILocation, IShip, ShipDirection } from '../../models/ship.model';
import { IBoard, IBoardItem } from '../../models/board.model';
import { IPlayer } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor() { }

  // Public create board method
  createBoard(size: number, ships: IShip[]): IBoard {
    const boardSchema: IBoardItem[][] = this.buildEmptyBoard(size);
    this.buildShips(ships, boardSchema);

    return {
      schema: boardSchema,
      ships
    };
  }

  // Build empty board
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

  // Generate location for ship and add to the board
  private buildShips(ships: IShip[], boardSchema: IBoardItem[][]) {
    // Generate and validate location
    ships.map(ship => {
      let locations = [];
      do {
        locations = this.setShipLocation(ship);
      } while (this.collision(locations, ships));
      ship.locations = locations;
    });

    // Add to the board
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

  // Random generator for ship location
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

  // Check collision for the location
  private collision(locations: ILocation[], ships: IShip[]): boolean {
    const neighborLocations = this.getNeighborLocations(locations);
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];

      // Check location
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations && ship.locations.find(
          location => location.row === locations[j].row && location.column === locations[j].column)
        ) {
          return true;
        }
      }

      // Check neighbor locations
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

  // Generator neighbor location for ship
  getNeighborLocations(locations: ILocation[]): ILocation[] {
    let neighborLocations = [];
    locations.forEach(location => {
      const allLocations = [
          {row: location.row - 1, column: location.column},
          {row: location.row + 1, column: location.column},
          {row: location.row, column: location.column - 1},
          {row: location.row, column: location.column + 1},
          {row: location.row - 1, column: location.column - 1},
          {row: location.row + 1, column: location.column + 1},
          {row: location.row + 1, column: location.column - 1},
          {row: location.row - 1, column: location.column + 1}
        ];

      // Push unique location only
      allLocations.forEach(item => {
        if (!neighborLocations.length) {
          neighborLocations.push(item);
        }
        if (!neighborLocations.find(loc => item.row === loc.row && item.column === loc.column)) {
          neighborLocations.push(item);
        }
      });
    });

    // Validate location
    neighborLocations = neighborLocations.filter(location => {
      if (location.row < 0 || location.row > 9) {
        return false;
      }
      if (location.column < 0 || location.column > 9) {
        return false;
      }

      return !locations.find(loc => location.row === loc.row && location.column === loc.column);
    });

    return neighborLocations;
  }

  // Random shot behavior method
  public randomShot(player: IPlayer, board: IBoard): void {
    const randomRow = this.getRandomInt(0, 9);
    const randomColumn = this.getRandomInt(0, 9);

    // Duplicate shop
    if (board.schema[randomRow][randomColumn].crushed) {
      this.randomShot(player, board);
    }

    // Hit ship
    if (board.schema[randomRow][randomColumn].occupied) {
      player.points = player.points + 1;
      this.crushedShip(board, {row: randomRow, column: randomColumn});
    }

    // Hit empty
    board.schema[randomRow][randomColumn] = {...board.schema[randomRow][randomColumn], crushed: true };
  }

  // Shot on ship behavior
  crushedShip(board: IBoard, shotLocation: ILocation): void {
    const crushedShipId = board.schema[shotLocation.row][shotLocation.column].shipId;
    const crushedShip = board.ships.find(ship => ship.id === crushedShipId);

    // hit ship location
    crushedShip.locations = crushedShip.locations.filter(
      location => !(location.row === shotLocation.row && location.column === shotLocation.column)
    );

    // remove fully crashed ship
    if (crushedShip.locations.length === 0) {
      board.ships = board.ships.filter(ship => ship.id !== crushedShipId);
    }
    board.schema[shotLocation.row][shotLocation.column].occupied = false;
  }

  // Random method
  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
