import resources from "../resources";
import { Game, resource, RESOURCE_TYPE } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Img, ImgSystem } from '@eva/plugin-renderer-img';
import { Event, EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';
import { GAME_HEIGHT, GAME_WIDTH } from '../const';
import { PhysicsSystem } from '@eva/plugin-matterjs';
import { makeHorizental } from '../utils';
import { TilingSpriteSystem } from '@eva/plugin-renderer-tiling-sprite';
import { SoundSystem } from "@eva/plugin-sound";
import { ParticleSystem, Particles } from "@eva/plugin-renderer-particles"

let game: Game, appEvt: Event
export function createGame(canvas: HTMLCanvasElement) {

  resource.addResource(resources);
  if (!localStorage['QIANER_TEACH']) {
    resource.addResource([{
      name: 'teach',
      type: RESOURCE_TYPE.IMAGE,
      src: {
        image: {
          type: 'png',
          url: 'https://gw.alicdn.com/imgextra/i3/O1CN01Hz6kmt1nbyDFkGE8G_!!6000000005109-2-tps-1288-724.png'
        }
      },
      preload: true
    }])
  }
  resource.preload()

  // var orientation = (screen.orientation || {}).type || (screen as any).mozOrientation || (screen as any).msOrientation;
  // console.log(orientation, 123123123)
  // if (orientation === 'portrait-primary') {
  makeHorizental(canvas)
  // }


  game = new Game({
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
      new ParticleSystem(),
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
      new TilingSpriteSystem(),
      new SoundSystem()
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

  appEvt = game.scene.addComponent(new Event())
  return { game, appEvt }
}
export function getGame() {
  return { game, appEvt }
}