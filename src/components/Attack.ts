import { Component, GameObject, UpdateParams } from "@eva/eva.js"
import { Physics, PhysicsType } from "@eva/plugin-matterjs"
import { Event } from "@eva/plugin-renderer-event"
import { Particles, ParticleSystem } from "@eva/plugin-renderer-particles"
import { GAME_HEIGHT, GAME_WIDTH, QIAN_PHYSICS_CONFIG } from "../const"
import createArrow from "../gameObjects/arrow"
import { Attribute } from "./Attribute"
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

  particles: Particles

  init({ box, progress, string, myHPText }: IProps) {
    this.box = box;
    const emiterGo = new GameObject('emitter');

    this.particles = emiterGo.addComponent(new Particles({ resource: 'emitter' }));
    window.game.scene.addChild(emiterGo);
    this.particles.pause();
    // this.evt = evt
    this.progress = progress
    this.string = string
    this.myHPText = myHPText
    this.player = this.gameObject.getComponent(Player)
    this.progress.on('arrowReady', () => {
      // console.log('arrowReady')
      // const y = Math.cos(this.gameObject.transform.rotation) * -7
      // const x = Math.sin(this.gameObject.transform.rotation) * 7
      this.createArrow({ rotation: this.gameObject.transform.rotation, });
    })

    this.boxPhysics = this.box.getComponent(Physics);
    this.boxPhysics.on('collisionStart', (x: GameObject) => {
      let force = x.getComponent(Attribute)?.force || 0;
      const scale = x.transform.scale.x;
      x.destroy();
      if (!window.isPlayerClient) return;
      const player = this.gameObject.getComponent(Player);
      force /= scale ** 2;
      const lost = Math.round((force / .077) + ((scale - 1) * 5)) || 0;
      player.onAttack(lost);
      this.myHPText.setHP('我的HP：' + player.hp);
    })

    this.myHPText.setHP('我的HP：' + this.player.hp)

  }
  awake() {
    // this.createArrow({ x: 0, y: -7 })
  }
  beginTime = 0
  forceEnhance = 0
  onBegin() {
    if (this.progress?.canArrow()) {
      this.doing = true
      this.beginTime = Date.now();
      this.particles.play();
    }
  }
  onDrag(e: JoystickEventParams) {
    if (!this.doing) return;
    e.x = e.x || .0000001;
    e.y = e.y || .0001;
    let tmp = Math.atan(e.y / e.x);
    if (e.x < 0) {
      tmp = tmp + Math.PI / 2
    } else {
      tmp = tmp - Math.PI / 2
    }
    this.gameObject.transform.rotation = tmp


    const force = Math.sqrt(e.x ** 2 + e.y ** 2);
    this.string.setPercent(force * 100 + this.forceEnhance * 40);


    this.go.transform.rotation = tmp
    this.go.transform.position.x = this.gameObject.transform.position.x + e.x * 100;
    this.go.transform.position.y = this.gameObject.transform.position.y + e.y * 100;

    this.force = force;
    const forceTime = Math.min(Date.now() - this.beginTime, 1500);
    const forceEnhance = this.forceEnhance = (Math.max(forceTime, 500) - 500) / 1000;
    const scale = forceEnhance + 1
    this.go.transform.scale.x = scale;
    this.go.transform.scale.y = scale;

    const xy2 = (e.x ** 2 + e.y ** 2) ** .5;
    const rx = e.x / xy2;
    const ry = e.y / xy2;
    this.particles.emitter.ownerPos.set(
      this.go.transform.position.x - rx * scale * 100,
      this.go.transform.position.y - ry * scale * 100,
    )

  }
  onEnd() {
    this.string.setPercent(0);
    this.particles.emitter.emit = false;
    if (!this.doing) return

    const speed2 = this.force * 0.5 + .1 // 这是力
    const r = Math.tan(this.go.transform.rotation + Math.PI / 2)
    let x = Math.sqrt(speed2 / (1 + r ** 2))
    x = r > 0 ? -x : x
    let y = r * x
    const densityRate = (this.forceEnhance + 1) ** 2
    x *= densityRate;
    y *= densityRate;
    // __DEV__ && console.log(x, y);

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

    this.emit('emit', { position: this.go.transform.position, force: { x, y }, rotation: this.go.transform.rotation, forceEnhance: this.forceEnhance });
    this.forceEnhance = 0;
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
      y: position.y + this.gameObject.transform.position.y,
    })
    this.go.transform.rotation = rotation
    this.gameObject.scene.addChild(this.go);
  }
  limitPos = true
  update() {
    this.emit('beforerender');
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
        this.go.transform.position.x = this.gameObject.transform.position.x
        this.go.transform.position.y = this.gameObject.transform.position.y
      }
    }

    if (this.boxPhysics.body) {
      // @ts-ignore
      this.boxPhysics.Body.setPosition(this.boxPhysics.body, { x: this.gameObject.transform.position.x, y: this.gameObject.transform.position.y })
    };
    this.emit('onframe');
  }
}





