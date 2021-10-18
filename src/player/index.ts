import { InitToBStruct, InMsgStruct, ListToSStruct, MessageStruct, RankToBStruct, RankToSStruct, WatchToBStruct, WatchToSStruct } from "../socket/define";
import { Socket } from "../socket";
import Toast from "universal-toast";
class Player {
  id: number
  socket: Socket
  name: string
  time: number
  active = false
  userCount: number
  homeCount: number
  constructor() {

  }
  init(name: string, time: number, tel?: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket = new Socket(__SERVER_PATH__ + `?name=${encodeURIComponent(name)}&tel=${tel}&time=${time}`);
      this.socket.ws.onclose = e => {
        e.reason ? Toast.show(e.reason) :
          Toast.show('前方拥堵，请稍后刷新页面～', 10000);
        resolve(false);
      }
      this.socket.once('init', e => {
        const { id, userCount, homeCount } = (e as InitToBStruct).data;
        this.userCount = userCount;
        this.homeCount = homeCount;
        this.id = id;
        this.active = true;
        this.name = name;
        this.time = time;
        resolve(true);
      })
    })
  }
  // 获取房间列表
  async wantHomeList() {
    this.socket.send<ListToSStruct>({
      type: 'list',
      data: {
        from: 0,
        to: 10
      }
    });
    return this.socket.onceOrError('list');
  }
  // 加入（创建并加入）房间
  async wantJoinHome(token?: string) {
    this.socket.send<InMsgStruct>({
      type: 'in',
      data: {
        token,
        maxSize: 2,
        lock: false
      }
    });
    return this.socket.onceOrError('home');
  }
  async wantRankList(from = 0, to = 20) {
    this.socket.send<RankToSStruct>({
      type: 'rank',
      data: {
        from,
        to
      }
    });
    const e = await this.socket.onceOrError('rank') as RankToBStruct;
    let index = from;
    for (const c of e.data.list) {
      c.index = ++index;
    }
    return e;
  }
  async want<T extends MessageStruct>(e: T) {
    this.socket.send(e);
    return this.socket.onceOrError(e.type);
  }
  // 加入观战
  async wantWatch(token: string) {
    return await this.want<WatchToSStruct>({
      type: 'watch',
      data: {
        token,
        join: true
      }
    }) as WatchToBStruct;
  }
}

export const netPlayer = new Player();