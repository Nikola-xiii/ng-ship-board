export enum ShipTypes {
  L = 'Ship L',
  I = 'Ship I',
  D = 'Ship Dot',
}

export interface IShip {
  type: ShipTypes;
  width: number;
}
