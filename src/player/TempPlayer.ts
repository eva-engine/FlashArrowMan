import EventEmitter from "eventemitter3";
import { MessageStruct, MessageType } from "../socket/define";

type DelayListenerStruct = {
  activeTime: number,
  data: MessageStruct,
  fn: (data: MessageStruct) => void
}

export class TempPlayer extends EventEmitter<MessageType> {


  private delay: number = NaN

  private extraWait: number = 0

  private delayQueue: DelayListenerStruct[] = []

  onRender() {
    const now = Date.now();
    while (this.delayQueue.length > 0) {
      const { activeTime, data, fn } = this.delayQueue[0];
      if (activeTime > now) return;
      this.delayQueue.shift();
      fn(data);
    };
  }

  delayOn(event: MessageType, fn: (data: MessageStruct) => void) {
    const handler = (m: MessageStruct) => {
      if (Number.isNaN(this.delay)) {
        this.delay = Date.now() - m.time;
      }
      this.delayQueue.push({
        activeTime: m.time + this.delay + this.extraWait,
        data: m,
        fn,
      });
    };
    return super.on(event, handler);
  };

  delayOnce(event: MessageType, fn: (data: MessageStruct) => void) {
    const handler = (m: MessageStruct) => {
      if (Number.isNaN(this.delay)) {
        this.delay = Date.now() - m.time;
      }
      this.delayQueue.push({
        activeTime: m.time + this.delay + this.extraWait,
        data: m,
        fn,
      });
    };
    return super.once(event, handler);
  };

  on(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.on(event, fn);
  }
  once(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.once(event, fn);
  }
}