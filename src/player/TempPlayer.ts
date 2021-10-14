import EventEmitter from "eventemitter3";
import { MessageStruct, MessageType } from "../socket/define";

export class TempPlayer extends EventEmitter<MessageType> {
  on(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.on(event, fn);
  }
  once(event: MessageType, fn: (data: MessageStruct) => void) {
    return super.once(event, fn);
  }
}