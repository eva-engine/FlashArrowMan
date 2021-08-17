import { Component, GameObject } from "@eva/eva.js";
import { Graphics } from "@eva/plugin-renderer-graphics";
import { BOW_CD, QIAN_CD } from "../const";

export default class Progress extends Component {

  private bowStartTime: number = 0
  private arrowStartTime: number = 0

  static componentName = 'Progress'
  public background: number = 0xeeeeee;
  public arrowColor: number = 0x9896FF;
  public bowColor: number = 0x4C41DC;
  private backGraphics: Graphics;
  private arrowGraphics: Graphics;
  private bowGraphics: Graphics;

  private arrowStop = false
  private bowStop = false

  init() {
    const back = new GameObject('back');
    const front = new GameObject('front')
    const bow = new GameObject('bow')
    this.gameObject.addChild(back)
    this.gameObject.addChild(front)
    this.gameObject.addChild(bow)

    this.backGraphics = back.addComponent(new Graphics({
      size: {
        width: 100,
        height: 100
      }
    }))
    this.arrowGraphics = front.addComponent(new Graphics())
    // this.bowGraphics = bow.addComponent(new Graphics())

    this.backGraphics.graphics.lineStyle(10, this.background)
    this.backGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2)
  }
  setArrowProgress(progress: number) {
    this.arrowGraphics.graphics.clear()
    this.arrowGraphics.graphics.lineStyle(10, this.arrowColor)
    this.arrowGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2 * progress)
  }
  setBowProgress(progress: number) {
    this.bowGraphics.graphics.clear()
    this.bowGraphics.graphics.lineStyle(10, this.bowColor)
    this.bowGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2 * progress)
  }
  update() {
    this.updateArrow()
    // this.updateBow()
  }
  updateArrow() {
    if (this.arrowStop) return
    let p = (Date.now() - this.arrowStartTime) / QIAN_CD
    p = p > 1 ? 1 : p
    if (p === 1) {
      this.arrowStop = true
      this.emit('arrowReady')
    }
    this.setArrowProgress(p)
  }
  updateBow() {
    if (this.bowStop) return
    let p = (Date.now() - this.bowStartTime) / BOW_CD
    p = p > 1 ? 1 : p
    if (p === 1) {
      this.bowStop = true
      this.emit('bowReady')
    }
    this.setBowProgress(p)
  }

  canBow() {
    return Date.now() - this.bowStartTime > BOW_CD
  }
  canArrow() {
    return Date.now() - this.arrowStartTime > QIAN_CD
  }

  bow() {
    this.bowStartTime = Date.now()
    this.bowStop = false
  }
  arrow() {
    this.arrowStartTime = Date.now()
    this.arrowStop = false
  }
}