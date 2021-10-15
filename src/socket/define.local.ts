import { MessageStruct } from "./define"

export type TurnType = 'attack' | 'emit'
export type EmitDataStruct = {
  type: 'emit';
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
  type: 'attack',
  hp: number
}

export type MoveDataStruct = {
  type: 'move',
  x: number,
  y: number,
  rotation: number,
  force: number,
  ax: number,
  ay: number
}

export type AttackMsgStruct = MessageStruct<AttackDataStruct, 'turn'>

export type EmitMsgStruct = MessageStruct<EmitDataStruct, 'turn'>

export type MoveMsgStruct = MessageStruct<MoveDataStruct, 'turn'>


export type UnionTurnStruct = AttackMsgStruct | EmitMsgStruct | MoveMsgStruct

