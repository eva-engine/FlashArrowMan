import { Component, GameObject } from "@eva/eva.js"
import { Physics, PhysicsType } from "@eva/plugin-matterjs"
import { Event } from "@eva/plugin-renderer-event"
import { Joystick, JOYSTICK_EVENT } from "eva-plugin-joystick"
import { GAME_HEIGHT, GAME_WIDTH, QIAN_PHYSICS_CONFIG } from "../const"
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
  private joystick: Joystick
  private boxPhysics: Physics

  init({ box, evt, progress, string, myHPText }: IProps) {
    this.box = box
    this.evt = evt
    this.progress = progress
    this.string = string
    this.myHPText = myHPText
    this.player = this.gameObject.getComponent(Player)
    this.progress.on('qianReady', () => {
      console.log('qianReady')
      const y = Math.cos(this.gameObject.transform.rotation) * -7
      const x = Math.sin(this.gameObject.transform.rotation) * 7
      this.createQian({ rotation: this.gameObject.transform.rotation, position: { x, y } })
    })

    this.boxPhysics = this.box.getComponent(Physics)
    this.boxPhysics.on('collisionStart', (x) => {
      console.log(x)
      x.destroy()
      const player = this.gameObject.getComponent(Player)
      player.onAttack(10)
      this.myHPText.setHP('HP：' + player.hp)
    })

    this.myHPText.setHP('HP：' + this.player.hp)


    const rightJsGo = new GameObject('Joystrick')
    this.joystick = rightJsGo.addComponent(new Joystick({
      boxImageResource: 'box',
      btnImageResource: 'btn',
      followPointer: {
        open: true,
        area: {
          x: GAME_WIDTH / 2, y: 0,
          width: GAME_WIDTH / 2,
          height: GAME_HEIGHT
        }
      }
    }))



    this.joystick.on(JOYSTICK_EVENT.Begin, (e) => {
      this.onBegin()
    })
    this.joystick.on(JOYSTICK_EVENT.Drag, (e) => {
      this.onDrag(e)
    })
    this.joystick.on(JOYSTICK_EVENT.End, (e) => {
      this.onEnd()
    })

    this.gameObject.scene.addChild(rightJsGo)


  }
  awake() {
    // this.createQian({ x: 0, y: -7 })
  }

  onBegin() {
    if (this.progress.canQian()) {
      this.doing = true
    }
  }
  onDrag(e) {
    if (!this.doing) return
    let tmp = Math.atan(e.y / e.x)
    if (e.x < 0) {
      tmp = tmp + Math.PI / 2
    } else {
      tmp = tmp - Math.PI / 2
    }
    this.gameObject.transform.rotation = tmp


    const force = Math.sqrt(e.x ** 2 + e.y ** 2)
    this.string.setPercent(force * 100 + 10)


    this.go.transform.rotation = tmp
    this.go.transform.position.x = this.gameObject.transform.position.x + e.x * 100
    this.go.transform.position.y = this.gameObject.transform.position.y + e.y * 100

    this.force = force
  }
  onEnd() {
    this.string.setPercent(0)
    if (!this.doing) return

    const speed2 = this.force * 0.003 // 这是力
    const r = Math.tan(this.go.transform.rotation + Math.PI / 2)
    let x = Math.sqrt(speed2 / (1 + r ** 2))
    x = r > 0 ? -x : x
    let y = r * x
    console.log(x, y)

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

    sendEmitQian({ position: this.go.transform.position, force: { x, y }, rotation: this.go.transform.rotation })
    let go1 = this.go
    this.go = undefined
    setTimeout(() => {
      try {
        go1.destroy()
      } catch (e) { }
    }, 3000)

    this.doing = false
  }
  createQian({ position = { x: 0, y: 0 }, rotation = 0 }) {
    this.go = createQian({
      x: position.x + this.gameObject.transform.position.x,
      y: position.y + this.gameObject.transform.position.y
    })
    this.go.transform.rotation = rotation
    this.gameObject.scene.addChild(this.go)
  }
  update() {
    if (!this.doing && this.go) {
      this.go.transform.position.x = this.gameObject.transform.position.x
      this.go.transform.position.y = this.gameObject.transform.position.y - 10
    }
    if (this.boxPhysics.body) {
      // @ts-ignore
      this.boxPhysics.Body.setPosition(this.boxPhysics.body, {x: this.gameObject.transform.position.x,y:this.gameObject.transform.position.y})
    }
  }
}





