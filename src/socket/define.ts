export type ToSType = 'in' | 'out' | 'ready' | 'turn' | 'list' | 'watch' | 'rank' | 'failure';
export type ToBType = 'home' | 'error' | 'begin' | 'init' | 'list' | 'watch' | 'rank';
export type MessageType = ToBType | ToSType;
export type MessageStruct<D = unknown, T extends MessageType = MessageType> = {
  type: T,
  data: D,
  target?: number[] | 'all',
  from?: number,
  time?: number
}
export type InitToBStruct = MessageStruct<{
  id: number,
  homeCount: number,
  userCount: number
}, 'init'>
export type InMsgStruct = MessageStruct<{
  token?: string,
  maxSize?: number,
  lock?: boolean,
}, 'in'>
export type HomeMsgStruct = MessageStruct<{
  users: { id: number, ready: boolean, name: string }[],
  running: boolean,
  master?: number,
  masterName?: string
  lock: boolean,
  maxSize: number,
  token: string
}, 'home'>

export type ListToSStruct = MessageStruct<{
  from: number,
  to: number
}, 'list'>
export type ListToBStruct = MessageStruct<HomeMsgStruct['data'][], 'list'>

export type WatchToSStruct = MessageStruct<{
  token?: string,
  join: boolean
}, 'watch'>;
export type WatchToBStruct = MessageStruct<HomeMsgStruct['data'] | false, 'watch'>;

export type RankToSStruct = MessageStruct<{
  from: number,
  to: number
}, 'rank'>;
export type RankToBStruct = MessageStruct<{
  list: UserData,
  count: number,
  index: number,
  score: number
}, 'rank'>;
export type UserItem = {
  id: number,
  score: number,
  index?: number
  name: string,
  token: string,
  updateTime: number,
  createTime: number,
  //连胜、连败次数
  winTimes: number,
  failureTimes: number
}
export type UserData = UserItem[]