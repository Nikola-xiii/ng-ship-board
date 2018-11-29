import { IShip, ShipTypes } from './ship.model';

export interface IBoard {
  schema: IBoardItem[][];
  ships: IShip[];
}

export interface IBoardItem {
  occupied: boolean;
  crushed: boolean;
  shipId: number;
  shipType: ShipTypes;
}
