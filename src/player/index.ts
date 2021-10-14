import { InitToBStruct, InMsgStruct, ListToSStruct, RankToSStruct } from "../socket/define";
import { Socket } from "../socket";

class Player {
  id: number
  socket: Socket
  name: string
  time: number
  active = false
  constructor() {

  }
  init(name: string, time: number) {
    return new Promise(resolve => {
      this.socket = new Socket(__SERVER_PATH__ + `?name=${encodeURIComponent(name)}&time=${time}`);
      this.socket.ws.onclose = e => {
        // TODO
        console.log(e.reason);
        resolve(false);
      }
      this.socket.once('init', e => {
        const { id, userCount, homeCount } = (e as InitToBStruct).data;
        this.id = id;
        this.active = true;
        this.name = name;
        this.time = time;
        (document.querySelector('#countBoard') as HTMLDivElement).innerText = `房间数:${homeCount}, 玩家数:${userCount}`
        resolve(true);
      })
    })
  }
  // 获取房间列表
  wantHomeList() {
    this.socket.send<ListToSStruct>({
      type: 'list',
      data: {
        from: 0,
        to: 10
      }
    });
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
  async wantRankList() {
    this.socket.send<RankToSStruct>({
      type: 'rank',
      data: {
        from: 0,
        to: 20
      }
    });
    return this.socket.onceOrError('rank');
  }
}

export const netPlayer = new Player();