import { Component } from "@eva/eva.js";
import { HomeMsgStruct } from "src/type";
import event from "../event";
import { onAttack } from "../socketUtil";

export default class Player extends Component {
  hp: number = 80;
  awake() {
    event.on('sendEveryOneMyHP', () =>{
      onAttack({ hp: this.hp })
    })
  }
  onAttack(num: number) {
    this.hp -= num
    this.hp = Math.max(0, this.hp)
    onAttack({ hp: this.hp })
    if (this.hp === 0) {
      this.gameOver()
    }
  }
  gameOver() {
    alert('你输了！但是，那又怎样～')
    location.reload()
  }
}