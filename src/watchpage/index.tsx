import { render } from "react-dom";
import { netPlayer } from "../player";
import { ListToBStruct, RankToBStruct } from "../socket/define";
import { HomePage } from "./page/home";
import { RankPage } from "./page/rank";

export async function initWatchPage() {
  const e = await netPlayer.wantHomeList() as ListToBStruct;
  const e2 = await netPlayer.wantRankList() as RankToBStruct;
  render(
    < div className="container">
      <HomePage propHomes={e.data}></HomePage>
      <RankPage propRanks={e2.data}></RankPage>
    </div >
    , document.querySelector('#react-app'));
}