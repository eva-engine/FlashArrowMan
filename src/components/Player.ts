import { Component } from "@eva/eva.js";
import { onAttack } from "../socketUtil";

export default class Player extends Component {
  hp: number;
  onAttack(num: number) {
    this.hp -= num
    this.hp = Math.max(0, this.hp)
    onAttack({ hp: this.hp })
    if (this.hp === 0) {
      this.gameOver()
    }
  }
  gameOver() {
  }
}