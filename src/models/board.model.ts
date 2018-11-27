import { ShipTypes } from './ship.model';

export interface IBoard {
  schema: IBoardItem[][];
  ship: number;
}

export interface IBoardItem {
  occupied: boolean;
  crushed: boolean;
  shipType: ShipTypes;
}
