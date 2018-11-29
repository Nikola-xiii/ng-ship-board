import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlayer } from '../../models/player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input()
  player: IPlayer;

  @Output()
  shot = new EventEmitter();

  constructor() { }

  playerShot() {
    this.shot.emit(this.player);
  }
}
