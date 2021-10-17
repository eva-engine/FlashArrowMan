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
  const [searchValue, setSearchValue] = useState()

  useEffect(() => {
    setInterval(async () => {
      refresh()
    }, 3000);
  }, []);
  const refresh = async () => {
    const e = await netPlayer.wantHomeList() as ListToBStruct;
    setHomes(e.data);
  }

  const select = (token: string) => {
    watcher.watch(token)
  }

  const search = (e: any) => {
    setSearchValue(e.target.value)
  }
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
          resolution: window.devicePixelRatio / 2,
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
      <div className="homelist">
        <div className="list-title">
          房间列表
          <span className="refresh" onClick={refresh}>刷新</span>
        </div>
        <input type="text" className="search" onKeyUp={search} />

        {
          homes.filter(({ masterName }) => searchValue ? masterName.indexOf(searchValue) > -1 : true).map(home => (
            <div key={home.token} className="item" onClick={() => select(home.token)}>
              <div className="name">{home.masterName}</div>
              <div className="count">人数：{home.users.length}</div>
            </div>
          ))
        }
      </div>
      <canvas id="appCanvas"></canvas>
    </div>
  )
}