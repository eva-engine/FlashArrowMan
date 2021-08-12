import { Component, GameObject } from "@eva/eva.js"
import { Physics, PhysicsType } from "@eva/plugin-matterjs"
import { Event } from "@eva/plugin-renderer-event"
import { QIAN_PHYSICS_CONFIG } from "../const"
import createQian from "../gameObjects/qian"
import { sendEmitQian } from "../socketUtil"
import BowString from "./BowString"
import HPText from "./HPText"
import Player from "./Player"
import Progress from "./Progress"
interface IProps {
  box: GameObject;
  evt: Event;
  progress: Progress;
  myHPText: HPText;
  string: BowString;
}
export default class Attack extends Component {

  static componentName = 'Attack'

  private go: GameObject
  private startPos: { x: number, y: number }
  private startQian = { x: 0, y: 0 }
  private force: number
  private doing: boolean = false
  private evt: Event
  private box: GameObject
  private progress: Progress
  private myHPText: HPText
  private string: BowString
  private player: Player

  init({ box, evt, progress, string, myHPText }: IProps) {
    this.box = box
    this.evt = evt
    this.progress = progress
    this.string = string
    this.myHPText = myHPText
    this.player = this.gameObject.getComponent(Player)
    this.evt.on('touchstart', (e) => this.touchstart(e))
    this.evt.on('touchmove', (e) => this.touchmove(e))
    this.evt.on('touchend', () => this.touchend())
    this.evt.on('touchendoutside', () => this.touchend())
    this.progress.on('qianReady', () => {
      console.log('qianReady')
      const y = Math.cos(this.gameObject.transform.rotation) * -7
      const x = Math.sin(this.gameObject.transform.rotation) * 7
      this.createQian({ rotation: this.gameObject.transform.rotation, position: { x, y } })
    })

    this.box.getComponent(Physics).on('collisionStart', (x) => {
      console.log(x)
      x.destroy()
      const player = this.gameObject.getComponent(Player)
      player.onAttack(10)
      this.myHPText.setHP('HP：' + player.hp)
    })

    this.myHPText.setHP('HP：' + this.player.hp)
  }
  awake() {
    // this.createQian({ x: 0, y: -7 })
  }

  touchstart(e) {
    console.log(e.data.position,9999)
    if (this.progress.canBow()) {
      this.progress.bow()
      // 放置弓箭
      this.gameObject.transform.position.x = e.data.position.x
      this.gameObject.transform.position.y = e.data.position.y

      this.box.transform.position.x = e.data.position.x
      this.box.transform.position.y = e.data.position.y


      // 记录起始位置
      this.startQian.x = e.data.position.x
      this.startQian.y = e.data.position.y
      this.startPos = e.data.position
    }
    if (this.progress.canQian()) {
      this.doing = true
    }
  }
  touchmove(e) {
    if (!this.doing) return
    const dx = e.data.position.x - this.startPos.x
    const dy = e.data.position.y - this.startPos.y
    if (dy < 0) return
    const r = Math.atan(dy / dx)
    if (Math.abs(r) < 20 / 180 * Math.PI) return
    let tmp = Math.PI / 2 - Math.abs(r)
    tmp = r < 0 ? tmp : -tmp
    this.go.transform.rotation = tmp
    this.gameObject.transform.rotation = tmp

    const pow2 = dx ** 2 + dy ** 2
    let tx = dx, ty = dy
    const c = 583000
    if (pow2 > c) {
      const a = Math.sqrt(c / pow2)
      tx = a * tx
      ty = a * ty
    }

    this.force = Math.sqrt(tx ** 2 + ty ** 2)

    const bx = 20 * Math.sqrt(1 / (tx ** 2 + ty ** 2)) * tx
    const by = bx / tx * ty
    // const bx = 0
    // const by = 0
    // console.log(tx, ty)

    this.go.transform.position.x = this.startPos.x + tx * 0.3 - bx
    this.go.transform.position.y = this.startPos.y + ty * 0.3 - by


    this.string.setPercent(this.force * 0.3 - 10)
  }
  touchend() {
    if (!this.doing) return
    console.log(this.force, 'force')
    const speed2 = (0.007 + this.force / 18000) / 10 // 这是力
    const r = Math.tan(this.go.transform.rotation + Math.PI / 2)
    let x = Math.sqrt(speed2 / (1 + r ** 2))
    x = r > 0 ? -x : x
    let y = r * x
    console.log(x, y)
    // x =0
    // y=-0.2
    this.go.addComponent(new Physics({
      type: PhysicsType.RECTANGLE,
      bodyOptions: {
        ...QIAN_PHYSICS_CONFIG,
        force: {
          x,
          y,
        },
        collisionFilter: {
          group: -1
        }
      },
      stopRotation: true,
    }))
    this.progress.qian()
    this.progress.bow()
    this.doing = false
    this.string.setPercent(0)
    console.log({ x, y }, 1)
    sendEmitQian({ position: this.go.transform.position, force: { x, y }, rotation: this.go.transform.rotation })
    let go1 = this.go
    setTimeout(() => {
      try {
        go1.destroy()
      } catch (e) { }
    }, 3000)
  }
  createQian({ position = { x: 0, y: 0 }, rotation = 0 }) {
    this.go = createQian({
      x: position.x + this.gameObject.transform.position.x,
      y: position.y + this.gameObject.transform.position.y
    })
    this.go.transform.rotation = rotation
    this.gameObject.scene.addChild(this.go)
  }
}