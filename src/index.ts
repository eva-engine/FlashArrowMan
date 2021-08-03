import resources from './resources';

import { Component, Game, GameObject, resource } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { Event, EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { Graphics, GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { Text, TextSystem } from '@eva/plugin-renderer-text';
import { BOW_CD, GAME_HEIGHT, GAME_WIDTH, QIAN_CD } from './const';
import createQian from './gameObjects/qian';
import { Physics, PhysicsSystem, PhysicsType } from '@eva/plugin-matterjs';
import Progress from './components/Progress';
import BowString from './components/BowString';

resource.addResource(resources);

const game = new Game({
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0xffffff,
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

game.scene.transform.size.width = GAME_WIDTH;
game.scene.transform.size.height = GAME_HEIGHT;

const graphics = game.scene.addComponent(new Graphics())
graphics.graphics.beginFill(0x666666, 1)
graphics.graphics.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
graphics.graphics.endFill()


let bow = new GameObject('bow', {
  size: {
    width: 200,
    height: 44,
  },
  position: { x: Infinity, y: Infinity },
  origin: { x: 0.5, y: 12 / 44 }
})

bow.addComponent(new Img({ resource: 'bow' }))
game.scene.addChild(bow)



const bowString = new GameObject('bowString', {
  anchor: {
    x: 0.5, y: 0
  },
})

const string = bowString.addComponent(new BowString())

string.setPercent(80)

bow.addChild(bowString)

const progressGo = new GameObject('', {
  position: {
    x: 70, y: 1000
  }
})

const progress = progressGo.addComponent(new Progress({
}))

game.scene.addChild(progressGo)

let go: GameObject
let startPos: { x: number, y: number }
let startQian = { x: 0, y: 0 }
let force: number
let doing = false
const evt = game.scene.addComponent(new Event())
evt.on('touchstart', (e) => {
  if (progress.canBow()) {
    progress.bow()
    // 放置弓箭
    bow.transform.position.x = e.data.position.x
    bow.transform.position.y = e.data.position.y

    // 记录起始位置
    startQian.x = e.data.position.x
    startQian.y = e.data.position.y
    startPos = e.data.position
  }
  if (progress.canQian()) {
    go = createQian(bow.transform.position)
    game.scene.addChild(go)
    doing = true
  }
})
evt.on('touchmove', (e) => {
  if (!doing) return
  const dx = e.data.position.x - startPos.x
  const dy = e.data.position.y - startPos.y
  if (dy < 0) return
  const r = Math.atan(dy / dx)
  if (Math.abs(r) < 20 / 180 * Math.PI) return
  let tmp = Math.PI / 2 - Math.abs(r)
  tmp = r < 0 ? tmp : -tmp
  go.transform.rotation = tmp
  bow.transform.rotation = tmp

  const pow2 = dx ** 2 + dy ** 2
  let tx = dx, ty = dy
  const c = 583000
  if (pow2 > c) {
    const a = Math.sqrt(c / pow2)
    tx = a * tx
    ty = a * ty
  }

  force = Math.sqrt(tx ** 2 + ty ** 2)

  const bx = 20 * Math.sqrt(1 / (tx ** 2 + ty ** 2)) * tx
  const by = bx / tx * ty
  // const bx = 0
  // const by = 0
  // console.log(tx, ty)

  go.transform.position.x = startPos.x + tx * 0.3 - bx
  go.transform.position.y = startPos.y + ty * 0.3 - by


  string.setPercent(force * 0.3 - 10)
})

evt.on('touchend', () => {
  if (!doing) return
  console.log(force)
  const speed2 = (0.007 + force / 18000) / 10 // 这是力
  const r = Math.tan(go.transform.rotation + Math.PI / 2)
  let x = Math.sqrt(speed2 / (1 + r ** 2))
  x = r > 0 ? -x : x
  let y = r * x
  console.log(x, y)
  // x =0
  // y=-0.2
  go.addComponent(new Physics({
    type: PhysicsType.RECTANGLE,
    bodyOptions: {
      isStatic: false, // Whether the object is still, any force acting on the object in a static state will not produce any effect
      restitution: 0.8,
      frictionAir: 0.02,
      friction: 0,
      frictionStatic: 0,
      force: {
        x,
        y,
      },
    },
    stopRotation: true,
  }))
  progress.qian()
  progress.bow()
  doing = false
  string.setPercent(0)

})

evt.on('touchendoutside', () => {
  evt.emit('touchend')
})




const text = new GameObject('', {
  position: { x: 375, y: 40 },

  origin: {
    x: 0.5,
    y: 0.5
  },
})
text.addComponent(new Text({
  text: '我的很大，你忍一下',
  style: {
    fontSize: 70,
    fill: 0xffffff,
  }
}))
game.scene.addChild(text)




