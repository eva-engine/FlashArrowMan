import { useEffect, useState } from "react"
import { HomeMsgStruct, ListToBStruct } from "../socket/define"
import { netPlayer } from "../player"
import { beginGame } from "./game"
import Toast from "universal-toast"
import event from "src/event"
import Head from './head'

export function ListPage() {
  const randomNum = () => 200 + ~~(Math.random() * 50)
  const [homeList, setHomeList] = useState([] as unknown as ListToBStruct['data'])
  const quickStart = async () => {
    try {
      const result = await netPlayer.wantJoinHome() as HomeMsgStruct
      beginGame(result)
    } catch (e) {
      Toast.show('发生了一些小问题')
    }
  }
  const createRoom = async () => {
    try {
      const result = await netPlayer.wantJoinHome(Math.random().toString()) as HomeMsgStruct
      beginGame(result)
    } catch (e) {
      Toast.show('发生了一些小问题')
    }
  }
  const entry = async (token: string) => {
    try {
      const result = await netPlayer.wantJoinHome(token) as HomeMsgStruct
      beginGame(result)
    } catch (e) {
      Toast.show('发生了一些小问题')
    }
  }
  const fetchList = () => {

    netPlayer.wantHomeList().then((home: ListToBStruct) => {
      setHomeList(home.data)
    })
  }
  useEffect(() => {
    fetchList()
    let timer = setInterval(() => {
      fetchList()
    }, 1000)
    // event.on('gameStart', () => {
    //   clearInterval(timer)
    // })
    // event.on('gameOver', () => {
    //   let timer = setInterval(() => {
    //     fetchList
    //   }, 3000)
    // })
    return () => {
      clearInterval(timer)
    }

  }, []);
  const [rank, setRank] = useState('获取中...');
  useEffect(() => {
    netPlayer.wantRankList(0, 0).then(e => {
      setRank(e.data.index + '');
    })
  }, [])
  return <div className="list-container">
    <div className="list-header">
      <Head type="home" />
      <div className="head-pic"></div>
      <div className="game-name">闪箭侠</div>
      <div className="user-info">
        <span className="username">{netPlayer.name}</span>
        <span className="rank">排名：{rank}</span>
      </div>
    </div>
    <ul className="room-list">
      {homeList.map((item) => <li className="room-item" key={item.token} style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }} onClick={() => entry(item.token)}>
        <div className="room-title">
          {item.masterName}
        </div>
        <div className="people-count">人数：{item.users.length}</div>
      </li>)}
    </ul>
    <div className="actions">
      <div className="create-room" onClick={createRoom}>创建房间</div>
      <div className="quick-enter" onClick={quickStart}>快速开始</div>
    </div>
  </div >
}