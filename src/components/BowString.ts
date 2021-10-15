import { Component, GameObject } from "@eva/eva.js";
import { Graphics } from "@eva/plugin-renderer-graphics";

const DEFAULT_Y = 34
export default class BowString extends Component {
  public percent: number = 0;
  private leftGraphics: Graphics;
  private rightGraphics: Graphics;

  private point: { left: [number, number], right: [number, number] } = { left: [-80, DEFAULT_Y], right: [80, DEFAULT_Y] }

  init() {
    const left = new GameObject('back');
    const right = new GameObject('front')
    this.gameObject.addChild(left)
    this.gameObject.addChild(right)

    this.leftGraphics = left.addComponent(new Graphics())
    this.rightGraphics = right.addComponent(new Graphics())

  }

  setPercent(percent: number) {
    this.percent = percent;

    this.leftGraphics.graphics.clear()
    this.rightGraphics.graphics.clear()
    this.draw(this.leftGraphics.graphics, 'left')
    this.draw(this.rightGraphics.graphics, 'right')
  }
  draw(graphics: Graphics['graphics'], type: 'left' | 'right') {
    graphics.lineStyle(1, 0x000000)
    graphics.moveTo(...this.point[type])
    graphics.lineTo(0, this.percent + DEFAULT_Y);
  }
}