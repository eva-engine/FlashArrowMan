import "./watchpage/index.css";
import resources from './resources';

import { Game, resource } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { ImgSystem, Img } from '@eva/plugin-renderer-img';
import { EventSystem } from '@eva/plugin-renderer-event';
import { SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { TextSystem } from '@eva/plugin-renderer-text';
import { GAME_WIDTH } from './const';
import { PhysicsSystem } from '@eva/plugin-matterjs';
import { TilingSpriteSystem } from '@eva/plugin-renderer-tiling-sprite';
import { Watcher } from './watchpage';

export const WATCH_HEIGHT = GAME_WIDTH * 1.5;
resource.addResource(resources);
resource.preload()
const canvas = document.querySelector('#appCanvas') as HTMLCanvasElement;

export const game = new Game({
  systems: [
    new RendererSystem({
      canvas,
      width: GAME_WIDTH,
      height: WATCH_HEIGHT,
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
      world: {
        gravity: {
          y: 0, // gravity
        },
      },
    }),
    new TilingSpriteSystem()
  ],
});

game.scene.transform.size.width = GAME_WIDTH
game.scene.transform.size.height = WATCH_HEIGHT;

game.scene.addComponent(new Img({
  resource: 'background',
}))
new Watcher();