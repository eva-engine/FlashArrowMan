import React from 'react';
import resources from './resources';

import { Game, resource } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { Event, EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';
import { GAME_HEIGHT, GAME_WIDTH } from './const';
import { PhysicsSystem } from '@eva/plugin-matterjs';
import { makeHorizental } from './utils';
import { TilingSpriteSystem } from '@eva/plugin-renderer-tiling-sprite';
import { netPlayer } from './player';
import { initHole, renderHole } from './page/home';
import { createHome } from './entry'
window.netPlayer = netPlayer

window.React = React
// import VConsole from 'vconsole';

// new VConsole()

resource.addResource(resources);
resource.preload()
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

var orientation = (screen.orientation || {}).type || (screen as any).mozOrientation || (screen as any).msOrientation;
console.log(orientation, 123123123)
// if (orientation === 'portrait-primary') {
makeHorizental(canvas)
// }

export const game = new Game({
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
    }),
    new TilingSpriteSystem()
  ],
});

window.game = game;

game.scene.transform.size.width = GAME_WIDTH
game.scene.transform.size.height = GAME_HEIGHT;

// game.scene.transform.rotation = Math.PI / 2
// game.scene.transform.position.x = GAME_WIDTH

// const graphics = game.scene.addComponent(new Graphics())
// graphics.graphics.beginFill(0x666666, 1)
// graphics.graphics.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
// graphics.graphics.endFill()

game.scene.addComponent(new Img({
  resource: 'background',
}))

export const appEvt = game.scene.addComponent(new Event())

const entryBtn = document.body.querySelector('#entry') as HTMLButtonElement;
const entryHandler = async function () {
  const name = (document.body.querySelector('#roomNumber') as HTMLInputElement).value as string;
  if (name.length === 0) return;
  const time = Date.now();
  entryBtn.removeEventListener('click', entryHandler);
  const result = await netPlayer.init(name, time);
  if (result) {
    localStorage['QIANER_NAME'] = name;
    localStorage['QIANER_TIME'] = time;
    enter();
  } else {
    entryBtn.addEventListener('click', entryHandler);
  }
}

if ((localStorage['QIANER_NAME'] && localStorage['QIANER_TIME']) || (__DEV__ && location.search.length > 0)) {
  let name = localStorage['QIANER_NAME'];

  let time = localStorage['QIANER_TIME'];

  if (__DEV__) {
    if (location.search.length > 0) {
      name = location.search.slice(1);
      time = 1010101010110;
    }
  }

  const input = document.body.querySelector('#roomNumber') as HTMLInputElement;
  input.value = name;
  input.disabled = true;
  (async () => {
    const result = await netPlayer.init(name, time);
    if (result) {
      enter();
    } else {
      input.disabled = false;
      entryBtn.addEventListener('click', entryHandler);
    }
  })()
} else {
  entryBtn.addEventListener('click', entryHandler);
}

//
function enter() {
  loginToHome();
  // 进入房间列表界面
  // initHole();
  // renderHole();
}
function loginToHome() {
  const login = document.body.querySelector('.login');
  login.classList.add('hide');
  createHome()

  // const home = document.body.querySelector('.home');
  // home.classList.remove('hide');
}