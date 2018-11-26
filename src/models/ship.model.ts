export enum ShipTypes {
  L = 'Ship L',
  I = 'Ship I',
  D = 'Ship D',
}

export interface IShip {
  type: ShipTypes;
  width: number;
}
