export type ToSType = 'in' | 'out' | 'ready' | 'turn';
export type ToBType = 'home' | 'error' | 'begin' | 'init';
export type MessageType = ToSType | ToBType

export enum TurnType { attack = 'attack', emit = 'emit' }

export type MessageStruct<D = unknown> = {
  type: MessageType,
  data: D,
  target?: number[] | 'all',
  from?: number,
  time?: number
}

export type InMsgStruct = MessageStruct<{
  token: string,
  maxSize?: number,
  lock?: boolean
}>

export type HomeMsgStruct = MessageStruct<{
  users: { id: number, ready: boolean }[],
  running: true,
  master: number
}>


export type EmitDataStruct = {
  type: TurnType.emit;
  force: {
    x: number,
    y: number
  },
  position: {
    x: number,
    y: number
  }
  rotation: number,
}

export type AttackDataStruct = {
  type: TurnType.attack;
  hp: number
}

export type AttackMsgStruct = MessageStruct<AttackDataStruct>

export type EmitMsgStruct = MessageStruct<EmitDataStruct>


export type UnionTurnStruct = AttackMsgStruct | EmitMsgStruct




export type InitDataStruct = {
  id: number;
}

export type InitMsgStruct = MessageStruct<InitDataStruct>
