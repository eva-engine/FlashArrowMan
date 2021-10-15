import { InitToBStruct, InMsgStruct, ListToSStruct, MessageStruct, RankToSStruct, WatchToBStruct, WatchToSStruct } from "../socket/define";
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
        const countBoard = document.querySelector('#countBoard') as HTMLDivElement;
        // 兼容大屏端
        if (countBoard) {
          countBoard.innerText = `房间数:${homeCount}, 玩家数:${userCount}`;
          const nameDom = document.createElement('div');
          nameDom.id = 'unameBtn';
          nameDom.innerText = name;
          nameDom.addEventListener('click', async () => {
            console.log('功能未实现');
            // const newName = prompt('输入希望修改后的昵称');
            // if (!newName) return;
            // @TODO
          });
          countBoard.appendChild(nameDom);
        }

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