import { Game } from "@eva/eva.js";
import { PhysicsSystem } from "@eva/plugin-matterjs";
import { RendererSystem } from "@eva/plugin-renderer";
import { EventSystem } from "@eva/plugin-renderer-event";
import { GraphicsSystem } from "@eva/plugin-renderer-graphics";
import { Img, ImgSystem } from "@eva/plugin-renderer-img";
import { RenderSystem } from "@eva/plugin-renderer-render";
import { SpriteAnimationSystem } from "@eva/plugin-renderer-sprite-animation";
import { TextSystem } from "@eva/plugin-renderer-text";
import { TilingSpriteSystem } from "@eva/plugin-renderer-tiling-sprite";
import { TransitionSystem } from "@eva/plugin-transition";
import { useEffect, useState } from "react"
import { GAME_WIDTH } from "../../const";
import { netPlayer } from "../../player";
import { ListToBStruct } from "../../socket/define";
import { watcher, WATCH_HEIGHT } from "../../watch";

export function HomePage({ propHomes = [] }: { propHomes?: ListToBStruct['data'] }) {
  const [homes, setHomes] = useState(propHomes);

  const [watching, setWatching] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      const e = await netPlayer.wantHomeList() as ListToBStruct;
      setHomes(e.data);
    }, 3000);
  }, []);
  useEffect(() => {
    const canvas = document.querySelector('#appCanvas') as HTMLCanvasElement;

    const game = window.game = new Game({
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

    watcher.randomWatch();

  }, [])
  return (
    <div className="homepage" >
      {!watching ? <div className="homelist" style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#efefef' }}>
        {
          homes.map(home => (
            <div key={home.token}>{home.masterName}</div>
          ))
        }
      </div> : null}
      <canvas id="appCanvas"></canvas>
    </div>
  )
}