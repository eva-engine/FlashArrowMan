import { ListToBStruct } from "../socket/define";
import { netPlayer } from "../player";
import { SingleWatchGame } from "./game";

export class Watcher {
  constructor() { }
  async init() {
    const result = await netPlayer.init('qian-watcher', 15731056578, '12312312312');
    if (!result) alert('登录异常');
  }
  async randomWatch() {
    const timer = setInterval(async () => {
      if (this.game && !this.game._destroyed) return;
      const e = await netPlayer.wantHomeList() as ListToBStruct;
      if (e.data.length === 0) return;
      for (const home of e.data) {
        if (home.running) {
          return this.watch(home.token);
        }
      }
    }, 1000)
  }
  game: SingleWatchGame
  async watch(token: string) {
    const result = await netPlayer.wantWatch(token);
    if (!result.data) {
      console.log('观战失败');
      return;
    }
    this.game?.destroy();
    const game = this.game = new SingleWatchGame(result);
  }
}