import resources from './resources';

import { Game, GameObject, resource } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { Event, EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { Graphics, GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';
import { GAME_HEIGHT, GAME_WIDTH, QIAN_PHYSICS_CONFIG, SCENE_HEIGHT, SCENE_WIDTH } from './const';
import createQian from './gameObjects/qian';
import { Physics, PhysicsSystem, PhysicsType } from '@eva/plugin-matterjs';
import Progress from './components/Progress';
import BowString from './components/BowString';
import { AttackMsgStruct, EmitMsgStruct, TurnType } from './type';
import Player from './components/Player';
import createHP from './gameObjects/myHP';
import Attack from './components/Attack';
import event from './event';
import { makeHorizental } from './utils';

resource.addResource(resources);
const canvas = document.querySelector('#canvas')

var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
console.log(orientation,123123123)
if (orientation === 'portrait-primary') {
  makeHorizental(canvas)
}

const game = new Game({
  systems: [
    new RendererSystem({
      canvas,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      antialias: true,
      enableScroll: false,
      resolution: window.devicePixelRatio / 2
    }),
    new ImgSystem(),
    new TransitionSystem(),
    new SpriteAnimationSystem(),
    new RenderSystem(),
    new EventSystem(),
    new GraphicsSystem(),
    new TextSystem(),
    new PhysicsSystem({
      resolution: window.devicePixelRatio / 2,
      // isTest: true, // Whether to enable debugging mode
      // element: document.getElementById('game-container'), // Mount point of canvas node in debug mode
      world: {
        gravity: {
          y: 0, // gravity
        },
      },
    })
  ],
});

window.game = game

game.scene.transform.size.width = GAME_WIDTH
game.scene.transform.size.height = GAME_HEIGHT;

// game.scene.transform.rotation = Math.PI / 2
// game.scene.transform.position.x = GAME_WIDTH

const graphics = game.scene.addComponent(new Graphics())
graphics.graphics.beginFill(0x666666, 1)
graphics.graphics.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
graphics.graphics.endFill()
let i = 0
const evt = game.scene.addComponent(new Event())
evt.on('tap', ()=>{
  if (!i) {
    document.documentElement.requestFullscreen()
    i++
  }
})

let bow = new GameObject('bow', {
  size: {
    width: 200,
    height: 44,
  },
  position: { x: 375, y: 470 },
  origin: { x: 0.5, y: 12 / 44 }
})

bow.addComponent(new Img({ resource: 'bow' }))

bow.addComponent(new Player())

game.scene.addChild(bow)

const box = new GameObject('box', {
  position: { x: bow.transform.position.x, y: bow.transform.position.y + 26 },
  size: {
    width: 200,
    height: 44,
  },
  origin: {
    x: 0.5,
    y: 0.5
  }
})
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

game.scene.addChild(box)

const bowString = new GameObject('bowString', {
  anchor: {
    x: 0.5, y: 0
  },
})

const string = bowString.addComponent(new BowString())

string.setPercent(0)

bow.addChild(bowString)


const progressGo = new GameObject('', {
  position: {
    x: 70, y: 600
  }
})

const progress = progressGo.addComponent(new Progress({
}))

game.scene.addChild(progressGo)

const { hp: myHP, hpText: myHPText } = createHP({ position: { y: 670, x: 50 } })
game.scene.addChild(myHP)

bow.addComponent(new Attack({ box, evt, progress, myHPText, string }))


event.on('onTurn', data => {
  switch (data.data.type) {
    case TurnType.emit:
      emit(data as EmitMsgStruct);
      break;
    case TurnType.attack:
      attack(data as AttackMsgStruct);
      break;
  }
})


function emit(data: EmitMsgStruct) {
  console.log('onEmit')
  let { position: { x, y }, force, rotation } = (data as EmitMsgStruct).data
  x = GAME_WIDTH - x
  y = -y
  force.x = -force.x
  force.y = -force.y

  console.log(force, 2)

  let enemy = createQian({ x, y })
  enemy.transform.rotation = rotation + Math.PI

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
      enemy.destroy()
    } catch (e) { }
  }, 3000)
}


const { hp: enemyHP, hpText: enemyHPText } = createHP({ position: { y: 100, x: 50 } })
game.scene.addChild(enemyHP)

function attack(data: AttackMsgStruct) {
  enemyHPText.setHP('敌方HP: ' + data.data.hp)
  if (data.data.hp === 0) {
    alert('你赢了！但是，那又怎样～')
    location.reload()
  }
}
