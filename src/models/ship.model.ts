export enum ShipTypes {
  L = 'L',
  I = 'I',
  D = 'D',
}

export interface IShip {
  type: ShipTypes;
  width: number;
}

export enum ShipDirection {
  Left = 1,
  Right = 2,
  Top = 3,
  Bottom = 4
}
