import { Component, GameObject, UpdateParams } from "@eva/eva.js"
import { Physics, PhysicsType } from "@eva/plugin-matterjs"
import { Event } from "@eva/plugin-renderer-event"
import { GAME_HEIGHT, GAME_WIDTH, QIAN_PHYSICS_CONFIG } from "../const"
import createArrow from "../gameObjects/arrow"
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
interface JoystickEventParams {
  x: number;
  y: number;
  updateParams: UpdateParams;
}
export default class Attack extends Component {

  static componentName = 'Attack'

  public go: GameObject
  // private startPos: { x: number, y: number }
  // private startArrow = { x: 0, y: 0 }
  private force: number
  private doing: boolean = false
  // private evt: Event
  private box: GameObject
  private progress: Progress
  private myHPText: HPText
  private string: BowString
  private player: Player
  private boxPhysics: Physics

  init({ box, progress, string, myHPText }: IProps) {
    this.box = box
    // this.evt = evt
    this.progress = progress
    this.string = string
    this.myHPText = myHPText
    this.player = this.gameObject.getComponent(Player)
    this.progress.on('arrowReady', () => {
      // console.log('arrowReady')
      const y = Math.cos(this.gameObject.transform.rotation) * -7
      const x = Math.sin(this.gameObject.transform.rotation) * 7
      this.createArrow({ rotation: this.gameObject.transform.rotation, position: { x, y } });
    })

    this.boxPhysics = this.box.getComponent(Physics);
    this.boxPhysics.on('collisionStart', (x: GameObject) => {
      x.destroy();
      if (!window.isPlayerClient) return;
      const player = this.gameObject.getComponent(Player)
      player.onAttack(10)
      this.myHPText.setHP('HP：' + player.hp)
    })

    this.myHPText.setHP('HP：' + this.player.hp)

  }
  awake() {
    // this.createArrow({ x: 0, y: -7 })
  }

  onBegin() {
    if (this.progress?.canArrow()) {
      this.doing = true
    }
  }
  onDrag(e: JoystickEventParams) {
    if (!this.doing) return;
    let tmp = Math.atan((e.y || .0001) / (e.x || .0000001));
    if (e.x < 0) {
      tmp = tmp + Math.PI / 2
    } else {
      tmp = tmp - Math.PI / 2
    }
    this.gameObject.transform.rotation = tmp


    const force = Math.sqrt(e.x ** 2 + e.y ** 2);
    this.string.setPercent(force * 100)


    this.go.transform.rotation = tmp
    this.go.transform.position.x = this.gameObject.transform.position.x + e.x * 40
    this.go.transform.position.y = this.gameObject.transform.position.y + e.y * 40

    this.force = force
  }
  onEnd() {
    this.string.setPercent(0)
    if (!this.doing) return

    const speed2 = Math.max(this.force * 0.6, .1) // 这是力
    const r = Math.tan(this.go.transform.rotation + Math.PI / 2)
    let x = Math.sqrt(speed2 / (1 + r ** 2))
    x = r > 0 ? -x : x
    let y = r * x
    // __DEV__ && console.log(x, y)

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
    this.progress.arrow()

    this.emit('emit', { position: this.go.transform.position, force: { x, y }, rotation: this.go.transform.rotation });

    let go1 = this.go
    this.go = undefined
    setTimeout(() => {
      try {
        go1.destroy()
      } catch (e) {
        console.error(e);
      }
    }, 3000)

    this.doing = false
  }
  createArrow({ position = { x: 0, y: 0 }, rotation = 0 }) {
    this.go = createArrow({
      x: position.x + this.gameObject.transform.position.x,
      y: position.y + this.gameObject.transform.position.y
    })
    this.go.transform.rotation = rotation
    this.gameObject.scene.addChild(this.go);
  }
  limitPos = true
  update() {
    const position = this.gameObject.transform.position
    const { x, y } = position
    if (this.limitPos) {
      if (x < 100) {
        position.x = 100
      }
      if (y < 12) {
        position.y = 12
      }
      if (x > GAME_WIDTH - 100) {
        position.x = GAME_WIDTH - 100
      }
      if (y > GAME_HEIGHT - 32) {
        position.y = GAME_HEIGHT - 32
      }
      if (!this.doing && this.go) {
        this.go.transform.position.x = this.gameObject.transform.position.x + 40 * Math.sin(this.go.transform.rotation)
        this.go.transform.position.y = this.gameObject.transform.position.y - 40 * Math.cos(this.go.transform.rotation)
      }
    }

    if (this.boxPhysics.body) {
      // @ts-ignore
      this.boxPhysics.Body.setPosition(this.boxPhysics.body, { x: this.gameObject.transform.position.x, y: this.gameObject.transform.position.y })
    };
    this.emit('onframe');
  }
}





