import { Component, GameObject } from "@eva/eva.js";
import { Graphics } from "@eva/plugin-renderer-graphics";
import { BOW_CD, QIAN_CD } from "../const";

export default class Progress extends Component {

  private bowStartTime: number = 0
  private qianStartTime: number = 0

  static componentName = 'Progress'
  public background: number = 0xeeeeee;
  public qianColor: number = 0x9896FF;
  public bowColor: number = 0x4C41DC;
  private backGraphics: Graphics;
  private qianGraphics: Graphics;
  private bowGraphics: Graphics;

  private qianStop = false
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
    this.qianGraphics = front.addComponent(new Graphics())
    // this.bowGraphics = bow.addComponent(new Graphics())

    this.backGraphics.graphics.lineStyle(10, this.background)
    this.backGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2)
  }
  setQianProgress(progress: number) {
    this.qianGraphics.graphics.clear()
    this.qianGraphics.graphics.lineStyle(10, this.qianColor)
    this.qianGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2 * progress)
  }
  setBowProgress(progress: number) {
    this.bowGraphics.graphics.clear()
    this.bowGraphics.graphics.lineStyle(10, this.bowColor)
    this.bowGraphics.graphics.arc(0, 0, 40, 0, Math.PI * 2 * progress)
  }
  update() {
    this.updateQian()
    // this.updateBow()
  }
  updateQian() {
    if (this.qianStop) return
    let p = (Date.now() - this.qianStartTime) / QIAN_CD
    p = p > 1 ? 1 : p
    if (p === 1) {
      this.qianStop = true
      this.emit('qianReady')
    }
    this.setQianProgress(p)
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
  canQian() {
    return Date.now() - this.qianStartTime > QIAN_CD
  }

  bow() {
    this.bowStartTime = Date.now()
    this.bowStop = false
  }
  qian() {
    this.qianStartTime = Date.now()
    this.qianStop = false
  }
}