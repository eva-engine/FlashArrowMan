
import { GAME_HEIGHT, GAME_WIDTH, MOVE_SPEED, QIAN_PHYSICS_CONFIG } from '../const';
import createArrow from '../gameObjects/arrow';
import { Physics, PhysicsType } from '@eva/plugin-matterjs';
import Progress from '../components/Progress';
import BowString from '../components/BowString';
import { AttackMsgStruct, EmitDataStruct, EmitMsgStruct, MoveDataStruct, MoveMsgStruct, UnionTurnStruct } from '../socket/define.local';
import Player from '../components/Player';
import createHP from '../gameObjects/myHP';
import Attack from '../components/Attack';
import { Component, Game, GameObject } from "@eva/eva.js";
import { Joystick, JOYSTICK_EVENT } from 'eva-plugin-joystick';
import { Img } from '@eva/plugin-renderer-img';
import { TempPlayer } from '../player/TempPlayer';
import { netPlayer } from '../player';
import { HomeMsgStruct } from 'src/socket/define';
import HPText from '../components/HPText';
import { Event, HIT_AREA_TYPE } from '@eva/plugin-renderer-event';
import { getGame } from './gamebase';
import event from '../event';
import { FadeText } from '../gameObjects/FadeText';
import { Sound } from '@eva/plugin-sound';
import { Graphics } from '@eva/plugin-renderer-graphics';
let game: Game, appEvt: Event
// const gamePage = document.querySelector('.app-container');
export async function beginGame(e: HomeMsgStruct) {
  // gamePage.classList.remove('hide');
  event.emit('gameStart');
  if (!localStorage['QIANER_TEACH']) {
    await showTeach();
    localStorage['QIANER_TEACH'] = true;
  }
  new SingleGame(e);
}
async function showTeach() {
  return new Promise(resolve => {
    const { game, appEvt } = getGame();
    const bg = new GameObject('teachout', {
      size: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT
      }
    });
    const g = bg.addComponent(new Graphics());

    g.graphics.beginFill(0x000, .5).drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT).endFill();
    const go = new GameObject('teach', {
      position: {
        x: (GAME_WIDTH - 1288) * .5,
        y: GAME_HEIGHT - 600
      },
      size: {
        width: 1288,
        height: 418
      }
    });
    go.addComponent(new Img({ resource: 'teach' }));
    let ended = false;
    appEvt.on('touchstart', end);
    function end() {
      if (ended) return;
      ended = true;
      bg.destroy();
      resolve(true);
    }
    bg.addChild(go);
    game.scene.addChild(bg);
  })
}

// 一局游戏
export class SingleGame {
  eventer = new TempPlayer();
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
  shootSound: Sound
  attackSound: Sound

  initBow() {
    const bow = this.bow;
    bow.addComponent(new Img({ resource: 'bow' }))
    this.shootSound = bow.addComponent(new Sound({ resource: 'shoot' }));
    this.player = bow.addComponent(new Player())
    game.scene.addChild(bow);
    const bowString = new GameObject('bowString', {
      anchor: {
        x: 0.5, y: 0
      },
    })
    this.attackSound = bowString.addComponent(new Sound({
      resource: 'attack'
    }))
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
          group: -1
        },
        isStatic: true,
      },
    }))
    game.scene.addChild(box);
  }

  progress: Progress
  initProgress() {
    const progressGo = new GameObject('', {
      position: {
        x: 70, y: 600
      }
    })
    this.progress = progressGo.addComponent(new Progress({
    }))
    game.scene.addChild(progressGo);
  }

  myHPText: HPText
  enemyHPText: HPText
  initHp() {
    const { hp: myHP, hpText: myHPText } = createHP({ position: { y: 100, x: 1300 } })
    this.myHPText = myHPText;
    game.scene.addChild(myHP);
    const { hp: enemyHP, hpText: enemyHPText } = createHP({ position: { y: 100, x: 50 } })
    this.enemyHPText = enemyHPText;
    game.scene.addChild(enemyHP)
  }

  leftJsGo: GameObject
  leftJs: Joystick

  enemyName: string = '敌方';

  initLeftJs() {
    const leftJsGo = this.leftJsGo = new GameObject('Joystrick', {
      position: {
        x: 300,
        y: 670
      }
    })
    const joystick = this.leftJs = leftJsGo.addComponent(new Joystick({
      boxImageResource: 'box',
      btnImageResource: 'btn',
      btnRadius: 65,
      followPointer: {
        open: true,
        area: {
          x: 0, y: 0,
          width: GAME_WIDTH / 2,
          height: GAME_HEIGHT
        }
      }
    }))
    game.scene.addChild(leftJsGo)

    joystick.on(JOYSTICK_EVENT.Begin, (e) => {
      // __DEV__ && console.log('begin', e)
    })
    joystick.on(JOYSTICK_EVENT.Drag, (e) => {
      const dt = e.updateParams.deltaTime
      // @TODO 移动
      this.bow.transform.position.x += e.x * dt * MOVE_SPEED
      this.bow.transform.position.y += e.y * dt * MOVE_SPEED
    })
    joystick.on(JOYSTICK_EVENT.End, (e) => {
      // __DEV__ && console.log('end', e)
    })
  }
  rightJs: Joystick
  initRightJs() {
    const rightJsGo = new GameObject('Joystrick', {
      position: {
        x: 1300,
        y: 670
      }
    })
    this.rightJs = rightJsGo.addComponent(new Joystick({
      boxImageResource: 'box',
      btnImageResource: 'btn',
      btnRadius: 65,
      followPointer: {
        open: true,
        area: {
          x: GAME_WIDTH / 2, y: 0,
          width: GAME_WIDTH / 2,
          height: GAME_HEIGHT
        }
      }
    }))

    this.rightJs.on(JOYSTICK_EVENT.Begin, () => {
      this.attackController.onBegin()
    })
    this.rightJs.on(JOYSTICK_EVENT.Drag, (e) => {
      this.attackController.onDrag(e)
    })
    this.rightJs.on(JOYSTICK_EVENT.End, () => {
      this.attackController.onEnd()
    });

    this.bow.scene.addChild(rightJsGo)
  }

  enemyHp = 80
  reloadHome(e: HomeMsgStruct) {
    this.player.emit('onAttack');
    this.enemyName = e.data.users.find(({ name }) => name !== netPlayer.name)?.name || this.enemyName
  }

  initNetReactive() {

    this.eventer.on('home', e => {
      this.reloadHome(e as HomeMsgStruct);
    })

    this.eventer.once('out', e => {
      this.enemyHPText.setHP('敌人逃了，你赢了!');
      this.close();
    })

    this.eventer.on('turn', e => {
      if (e.from === netPlayer.id) return;
      const data = e.data as UnionTurnStruct['data'];
      switch (data.type) {
        case 'attack': {
          const lost = this.enemyHp - data.hp;
          this.enemyHp = data.hp;
          this.enemyHPText.setHP(this.enemyName + '的HP: ' + data.hp);
          if (lost > 0) {
            let tip = new FadeText({
              position: {
                x: this.enemyHPText.gameObject.transform.position.x,
                y: this.enemyHPText.gameObject.transform.position.y + 30,
              }
            }).show({
              text: '- ' + lost,
              style: {
                fill: 0xee7733,
                fontSize: 50
              }
            }, {
              speed: {
                x: 1,
                y: 1,
              },
              duration: 1000
            });

            const sound = tip.addComponent(new Sound({ resource: 'attack2' }));
            sound.volume = .4 + lost * .03;
            sound.play();
            game.scene.addChild(tip);
          }
          if (data.hp <= 0) {
            this.enemyHPText.setHP('你赢了');
            this.close();
          }
          break;
        }
        case 'emit': {
          let { position: { x, y }, force, rotation, forceEnhance } = data
          forceEnhance = forceEnhance || 0;
          x = GAME_WIDTH - x
          y = -y
          force.x = -force.x
          force.y = -force.y

          let enemy = createArrow({ x, y })
          enemy.transform.rotation = rotation + Math.PI
          enemy.transform.scale.x = 1 + forceEnhance;
          enemy.transform.scale.y = 1 + forceEnhance;
          const sound = enemy.addComponent(new Sound({ resource: 'shoot2' }));
          sound.volume = .4 + forceEnhance * .6;
          sound.play();
          enemy.addComponent(new Physics({
            type: PhysicsType.RECTANGLE,
            bodyOptions: {
              ...QIAN_PHYSICS_CONFIG,
              force,
              collisionFilter: {
                category: 1
              }
            },
            stopRotation: true,
          }))

          game.scene.addChild(enemy)

          setTimeout(() => {
            try {
              enemy.parent && enemy.destroy();
            } catch (e) {
              console.error(e)
            }
          }, 3000)
          break;
        }
        case 'move': {
          // @TODO
          break;
        }
      }
    });
    this.attackController.on('emit', (emitMsg: EmitDataStruct) => {
      this.shootSound.volume = .4 + (emitMsg.forceEnhance || 0) * .6;
      this.shootSound.play();
      netPlayer.socket.send<EmitMsgStruct>({
        type: 'turn',
        data: {
          type: 'emit',
          ...emitMsg
        }
      });
    });

    this.player.on('onAttack', d => {
      if (d > 0) {
        this.attackSound.volume = .4 + d * .03;
        this.attackSound.play();
        let tip = new FadeText({
          position: {
            x: this.bow.transform.position.x + 100,
            y: this.bow.transform.position.y - 80,
          }
        }).show({
          text: '- ' + (d || 0),
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
        game.scene.addChild(tip);
      }
      netPlayer.socket.send<AttackMsgStruct>({
        type: 'turn',
        data: {
          type: 'attack',
          hp: this.player.hp
        }
      })
    })
    this.player.on('gameover', () => {
      netPlayer.socket.send({
        type: 'failure',
        data: 0
      });
      this.enemyHPText.setHP('你输了');
      this.close();
    })

  }

  attackController: Attack
  constructor(e: HomeMsgStruct) {

    const { game: g, appEvt: evt } = getGame()
    game = g
    appEvt = evt
    // __DEV__ || document.documentElement.requestFullscreen();

    netPlayer.socket.registerPlayer(this.eventer);
    const { bow, box } = this;

    this.initBow();
    this.initBox();
    this.initProgress();
    this.initHp();
    this.attackController = bow.addComponent(new Attack({ box, evt: appEvt, progress: this.progress, myHPText: this.myHPText, string: this.string }))
    this.attackController.on('onframe', () => {
      netPlayer.socket.send<MoveMsgStruct>({
        type: 'turn',
        data: {
          type: 'move',
          x: this.bow.transform.position.x,
          y: this.bow.transform.position.y,
          rotation: this.bow.transform.rotation,
          force: this.string.percent,
          ax: this.attackController.go?.transform.position.x,
          ay: this.attackController.go?.transform.position.y,
          forceEnhance: this.attackController.forceEnhance
        }
      })
    })

    this.initLeftJs();
    this.initRightJs();
    this.initNetReactive();
    this.reloadHome(e);
    this.ready();
  }

  ready() {
    netPlayer.socket.send({
      type: 'ready',
      data: undefined
    });
    this.player.emit('onAttack');
  }
  close() {
    const j1 = this.leftJs;
    const j2 = this.rightJs;
    for (const j of [j1, j2]) {
      ((j as any).evt as Component).gameObject.destroy();
      j.gameObject.destroy();
    }
    delete this.leftJsGo;
    delete this.leftJs;
    delete this.rightJs;

    this.bow.removeComponent(this.attackController);
    setTimeout(() => {
      event.emit('gameOver')
      this.destroy();
    }, 2000);
  }
  destroy() {
    this.bow.destroy();
    this.box.destroy();
    const needDestroy = game.scene.gameObjects.filter(go => go !== game.scene);
    for (const go of needDestroy) {
      go.destroy();
    }
    netPlayer.socket.releasePlayer();
  }
}