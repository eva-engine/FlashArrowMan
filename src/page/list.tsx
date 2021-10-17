import { useEffect, useState } from "react"
import { HomeMsgStruct, ListToBStruct } from "../socket/define"
import { netPlayer } from "../player"
import { beginGame } from "./game"
import Toast from "universal-toast"

window.netPlayer = netPlayer

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
  useEffect(() => {
    netPlayer.wantHomeList().then((home: ListToBStruct) => {
      setHomeList(home.data)
    })
  }, []);
  const [rank, setRank] = useState('获取中...');
  useEffect(() => {
    netPlayer.wantRankList(0, 0).then(e => {
      setRank(e.data.index + '');
    })
  },[])
  return <div className="list-container">
    <div className="list-header">
      <div className="head-pic"></div>
      <div className="game-name">闪箭侠</div>
      <div className="user-info">
        <span className="username">{netPlayer.name}</span>
        <span className="rank">排名：{rank}</span>
      </div>
    </div>
    <ul className="room-list">
      {homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }} onClick={() => entry(item.token)}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}{homeList.map((item) => <li className="room-item" style={{
        backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`
      }}>
        <div className="room-title">
          {item.users.length}
        </div>
        <div className="people-count">人数：123</div>
      </li>)}
    </ul>
    <div className="actions">
      <div className="create-room" onClick={createRoom}>创建房间</div>
      <div className="quick-enter" onClick={quickStart}>快速开始</div>
    </div>
  </div>
}