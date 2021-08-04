export type ToSType = 'in' | 'out' | 'ready' | 'turn';
export type ToBType = 'home' | 'error' | 'begin';
export type MessageType = ToSType | ToBType

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
  force: {
    x: number,
    y: number
  },
  position: {
    x: number,
    y: number
  }
  rotation: number
}
export type EmitMsgStruct = MessageStruct<EmitDataStruct>

export type OnMsgStruct = MessageStruct<{
  hp: number,
}>