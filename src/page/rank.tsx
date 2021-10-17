import { useEffect, useState } from "react";
import { netPlayer } from "../player";
import { RankToBStruct } from "../socket/define";
import Head from "./head";
import "./rank.css";
export function RankPage() {

  const [state, setState] = useState({
    data: {
      list: []
    }
  } as RankToBStruct);

  useEffect(() => {
    reload();
  }, [])
  async function reload() {
    const e = await netPlayer.wantRankList(0, 50);
    setState(e);
  }

  return <div className="rank page">
    <div className="top">
      <Head type="rank" />
      <div>
        <div className="rank-card">
          <div className="name">{state.data.list[0]?.name}</div>
          <div className="score">{state.data.list[0]?.score}场</div>
        </div>
        <div className="rank-card">
          <div className="name">{state.data.list[1]?.name}</div>
          <div className="score">{state.data.list[1]?.score}场</div>
        </div>
        <div className="rank-card">
          <div className="name">{state.data.list[2]?.name}</div>
          <div className="score">{state.data.list[2]?.score}场</div>
        </div>
      </div>
    </div>
    <div className="last">
      <div className="rank-item">
        <div className="index">{state.data.index}</div>
        <div className="name">{netPlayer.name}</div>
        <div className="score">{state.data.score}场</div>
      </div>
      <div className="hr gray"></div>
      <br />
      {
        state.data.list.slice(3).map((item, index) =>
          <div key={index}>
            <div className="rank-item" >
              <div className="index">{index + 4}</div>
              <div className="name">{item.name}</div>
              <div className="score">{item.score}场</div>
            </div>
            <div className="hr gray"></div>
          </div>
        )
      }
    </div>
  </div>
}