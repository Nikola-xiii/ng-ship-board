export enum ShipTypes {
  L = 'L',
  I = 'I',
  D = 'D',
}

export interface IShip {
  type: ShipTypes;
  locations: ILocation[];
  width: number;
}

export interface ILocation {
  row: number;
  column: number;
}

export enum ShipDirection {
  Vertical = 1,
  Horizontal = 2
}
