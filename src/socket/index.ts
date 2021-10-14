import EventEmitter from "eventemitter3";
import type { TempPlayer } from "../player/TempPlayer";
import { MessageStruct, MessageType } from "./define";

export class Socket extends EventEmitter<MessageType> {
  ws: WebSocket
  tempPlayer: TempPlayer
  constructor(public url: string) {
    super();
    this.ws = new WebSocket(url);
    this.ws.onmessage = e => {
      const msg = e.data;
      const data = JSON.parse(msg) as MessageStruct;
      this.emit(data.type, data);
      if (this.tempPlayer) {
        this.tempPlayer.emit(data.type, data);
      }
    }
  }
  registerPlayer(player: TempPlayer) {
    this.tempPlayer = player;
  }
  releasePlayer() {
    this.tempPlayer.removeAllListeners();
    this.tempPlayer = undefined;
  }
  on(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.on(event, fn);
  }
  once(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.once(event, fn);
  }
  send<T extends MessageStruct>(msg: T) {
    this.ws.send(JSON.stringify(msg));
  }
  onceOrError(event: MessageType): Promise<MessageStruct> {
    return new Promise((resolve, reject) => {
      const handler = (e: MessageStruct) => {
        this.off(event, handler);
        this.off('error', handler);
        if (e.type === 'error') {
          reject(e);
        } else {
          resolve(e);
        }
      }
      this.once(event, handler);
      this.once('error', handler);
    })
  }
}