import { Component } from "@eva/eva.js"
import { Text } from "@eva/plugin-renderer-text"

export default class HPText extends Component {
  text: Text
  awake() {
    this.text = this.gameObject.getComponent(Text)
  }
  setHP(hp: string) {
    this.text.text = hp
  }
}