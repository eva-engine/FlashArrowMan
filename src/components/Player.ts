import { Component } from "@eva/eva.js";

export default class Player extends Component {
  static componentName = 'Player'
  hp: number = 80;
  onAttack(num: number) {
    this.hp -= num
    this.hp = Math.max(0, this.hp)
    this.emit('onAttack', num);
    if (this.hp === 0) {
      this.emit('gameover');
    }
  }
}