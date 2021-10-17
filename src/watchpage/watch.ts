import { ListToBStruct } from "../socket/define";
import { netPlayer } from "../player";
import { SingleWatchGame } from "./game";

export class Watcher {
  constructor() { }
  async init() {
    const result = await netPlayer.init('qian-watcher', 15731056578);
    if (!result) alert('登录异常');
  }
  async randomWatch() {
    const timer = setInterval(async () => {
      const e = await netPlayer.wantHomeList() as ListToBStruct;
      if (e.data.length === 0) return;
      clearInterval(timer);
      for (const home of e.data) {
        if (home.running) {
          return this.watch(home.token);
        }
      }
      this.watch(e.data[0].token);
    }, 1000)
  }
  async watch(token: string) {
    const result = await netPlayer.wantWatch(token);
    if (!result.data) {
      console.log('观战失败');
      return;
    }
    const game = new SingleWatchGame(result);
    if (__DEV__) {
      game.eventer.on('error', () => {
        console.log('over')
        setTimeout(() => {
          this.randomWatch();
        }, 1000);
      })
    }
  }
}