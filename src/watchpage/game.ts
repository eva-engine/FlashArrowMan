import { GAME_WIDTH } from "../const";
import { netPlayer } from "../player";
import { TempPlayer } from "../player/TempPlayer";
import { HomeMsgStruct, WatchToBStruct } from "../socket/define";
import { MoveDataStruct, UnionTurnStruct } from "../socket/define.local";
import { WATCH_HEIGHT } from "../watch";
import { Fighter } from "./fighter";

export class SingleWatchGame {
  eventer = new TempPlayer();
  fighterMap: Record<number, Fighter> = {}
  fighter1: Fighter
  fighter2: Fighter
  initFighter(id: number, name: string) {
    if (this.fighterMap[id]) return;
    const fighter = new Fighter(id, name, 80, this.fighter1 ? 1 : 0);
    this.fighterMap[fighter.id] = fighter;
    if (this.fighter1) {
      this.fighter2 = fighter;
    } else {
      this.fighter1 = fighter;
    }
  }
  async initEventer() {
    this.eventer.once('error', async () => {
      await Promise.resolve();
      this.destroy();
    })
  }
  constructor(data: WatchToBStruct) {
    netPlayer.socket.registerPlayer(this.eventer);
    for (const user of (data.data as HomeMsgStruct['data']).users) {
      if (user.ready) {
        this.initFighter(user.id, user.name);
      }
    }
    this.initEventer();
    this.eventer.on('home', async (e: HomeMsgStruct) => {
      let reached = Object.keys(this.fighterMap);
      for (const user of (e.data).users) {
        if (user.ready) {
          reached.splice(reached.indexOf(String(user.id)), 1);
          this.initFighter(user.id, user.name);
        }
        for (const left of reached) {
          this.fighterMap[left as unknown as number].destroy();
        }
      }
    })
    this.eventer.on('turn', (e: UnionTurnStruct) => {
      const fighter = this.fighterMap[e.from];
      if (!fighter) return;
      switch (e.data.type) {
        case 'move': {
          const [x, y] = this.reversePosition(e.data.x, e.data.y, fighter === this.fighter2);
          e.data.x = x;
          e.data.y = y;
          fighter === this.fighter2 && (e.data.rotation += Math.PI)
          const [ax, ay] = this.reversePosition(e.data.ax, e.data.ay, fighter === this.fighter2);
          e.data.ax = ax;
          e.data.ay = ay;
          fighter.handleMove(e.data);
          break;
        }
        case 'emit': {
          const [x, y] = this.reversePosition(e.data.position.x, e.data.position.y, fighter === this.fighter2);
          e.data.position.x = x;
          e.data.position.y = y;
          if (fighter === this.fighter2) {
            e.data.force.x *= -1;
            e.data.force.y *= -1;
            e.data.rotation += Math.PI;
          }
          fighter.handleEmit(e.data);
          break;
        }
        case 'attack': {
          fighter.handleAttack(e.data);
          break;
        }
      }
    });

  }
  _destroyed = false
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    netPlayer.socket.releasePlayer();
    this.fighter1?.destroy();
    this.fighter2?.destroy();
    const needDestroy = window.game.scene.transform.children.map(({ gameObject }) => gameObject)
    for (const go of needDestroy) {
      go.destroy();
    }
  }
  reversePosition(x: number, y: number, isFighter2: boolean): [number, number] {
    return isFighter2 ? [GAME_WIDTH - x, WATCH_HEIGHT / 2 - y] : [x, y + WATCH_HEIGHT / 2];
  }

}