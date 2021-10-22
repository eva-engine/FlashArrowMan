import { GameObject } from "@eva/eva.js";
import { Img } from "@eva/plugin-renderer-img";
import { Physics, PhysicsType } from "@eva/plugin-matterjs";
import BowString from "../components/BowString";
import Player from "../components/Player";
import { WATCH_HEIGHT } from "../watch";
import { AttackDataStruct, EmitDataStruct, MoveDataStruct } from "../socket/define.local";
import createArrow from "../gameObjects/arrow";
import { QIAN_PHYSICS_CONFIG } from "../const";
import Attack from "../components/Attack";
import Progress from "../components/Progress";
import HPText from "../components/HPText";
import createHP from "../gameObjects/myHP";
import { FadeText } from "../gameObjects/FadeText";

export class Fighter {

  bow = new GameObject('bow', {
    size: {
      width: 200,
      height: 44,
    },
    position: { x: 812, y: 470 },
    origin: { x: 0.5, y: 12 / 44 }
  })
  box = new GameObject('box', {
    position: { x: this.bow.transform.position.x, y: this.bow.transform.position.y + 26 },
    size: {
      width: 200,
      height: 44,
    },
    origin: {
      x: 0.5,
      y: 0.5
    }
  })
  string: BowString
  player: Player
  initBow() {
    const bow = this.bow;
    bow.addComponent(new Img({ resource: 'bow' }))
    this.player = bow.addComponent(new Player())
    window.game.scene.addChild(bow);
    const bowString = new GameObject('bowString', {
      anchor: {
        x: 0.5, y: 0
      },
    })
    const string = this.string = bowString.addComponent(new BowString())
    string.setPercent(0);
    bow.addChild(bowString);
  }
  initBox() {
    const box = this.box;
    box.addComponent(new Physics({
      type: PhysicsType.RECTANGLE,
      bodyOptions: {
        restitution: 0,
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        stopRotation: false,
        collisionFilter: {
          group: -this.index - 1
        },
        isStatic: true,
      },
    }))
    window.game.scene.addChild(box);
  }
  progress: Progress
  initProgress() {
    const progressGo = new GameObject('', {
      position: {
        x: -700, y: -300
      },
    });
    this.progress = progressGo.addComponent(new Progress({
    }))
    window.game.scene.addChild(progressGo);
  }
  myHPText: HPText
  initHp() {
    const { hp: myHP, hpText: myHPText } = createHP({ position: { y: WATCH_HEIGHT / 2 + (.5 - this.index) * 100, x: 50 } })
    this.myHPText = myHPText;
    window.game.scene.addChild(myHP);
  }
  attackController: Attack
  constructor(public id: number, public name: string, public hp: number, public index: number) {
    this.initBow();
    this.initBox();
    this.initProgress();
    this.initHp();
    this.attackController = this.bow.addComponent(new Attack({ box: this.box, progress: this.progress, myHPText: this.myHPText, string: this.string }))
    this.myHPText.setHP(`HP: ${this.hp} ${this.name}`);
    this.attackController.limitPos = false;
    // @ts-ignore
    __DEV__ && (window.attack = this.attackController);

  }
  handleMove(data: MoveDataStruct) {
    this.bow.transform.position.x = data.x;
    this.bow.transform.position.y = data.y;
    this.bow.transform.rotation = data.rotation;

    this.string.setPercent(data.force);

    if (!this.attackController.go) return;
    const oldVersion = data.forceEnhance === undefined;
    data.forceEnhance = data.forceEnhance || 0;
    const scale = data.forceEnhance + 1;
    if (oldVersion) {
      data.ax += Math.sin(-data.rotation) * 40;
      data.ay += Math.cos(data.rotation) * 40;
    }
    this.attackController.go.transform.rotation = data.rotation
    this.attackController.go.transform.position.x = data.ax;
    this.attackController.go.transform.position.y = data.ay;
    this.attackController.go.transform.scale.x = scale;
    this.attackController.go.transform.scale.y = scale;
    const r = -data.rotation;
    if (!oldVersion && (data.x !== data.ax || data.forceEnhance > 0)) {
      try {
        this.attackController.emitParticle.play();
        try {
          this.attackController.emitParticle.emitter.ownerPos.set(
            data.ax - Math.sin(r) * scale * 100,
            data.ay - Math.cos(r) * scale * 100,
          )
        } catch (e) {
          console.error(e)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
  handleEmit(data: EmitDataStruct) {
    let { position: { x, y }, rotation, force, forceEnhance } = data;
    forceEnhance = forceEnhance || 0;
    let arrow = createArrow({ x, y }, 'arrow' + this.index);
    arrow.transform.rotation = rotation;
    arrow.transform.scale.x = forceEnhance + 1;
    arrow.transform.scale.y = forceEnhance + 1;
    try {
      this.attackController.emitParticle.emitter.emit = false;
    } catch {

    }
    arrow.addComponent(new Physics({
      type: PhysicsType.RECTANGLE,
      bodyOptions: {
        ...QIAN_PHYSICS_CONFIG,
        force,
        collisionFilter: {
          group: -this.index - 1
        },
      },
      stopRotation: true,
    }))

    window.game.scene.addChild(arrow);

    setTimeout(() => {
      try {
        arrow.parent && arrow.destroy();
      } catch (e) {
        console.error(e)
      }
    }, 3000)
  }
  handleAttack(data: AttackDataStruct) {
    const lost = this.hp - data.hp;
    this.hp = data.hp;
    this.myHPText.setHP(`HP: ${data.hp} ${this.name}`);
    if (lost === 0) return;
    let tip = new FadeText({
      position: {
        x: this.bow.transform.position.x + 100,
        y: this.bow.transform.position.y - 80,
      }
    }).show({
      text: '- ' + lost,
      style: {
        fill: 0xff3333,
        fontSize: 60
      }
    }, {
      speed: {
        x: 2,
        y: -3,
      },
      duration: 500
    });
    window.game.scene.addChild(tip);
  }
  destroy() {
    try {
      this.attackController.go?.transform.parent && this.attackController.go.destroy();
      this.bow.destroy();
      this.box.destroy();
      this.myHPText.gameObject.destroy();
      this.progress.gameObject.destroy();
    } catch { }

  }
}