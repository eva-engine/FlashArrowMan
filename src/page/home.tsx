// import { netPlayer } from "../player";
// import { HomeMsgStruct, ListToBStruct, RankToBStruct } from "../socket/define";
// import { beginGame } from "./game";
// import "./home.css"

// const homeTargetItem = document.querySelector('#homeTargetItem') as HTMLDivElement;
// export function initHole() {
//   document.querySelectorAll('.home .head .item').forEach((ele, index) => {
//     ele.addEventListener('click', () => {
//       if (index === 0) {
//         homeTargetItem.classList.remove('second');
//       } else {
//         homeTargetItem.classList.add('second');
//       }
//       renderHole();
//     })
//   });
//   const enterBtn = document.querySelector('#enterBtn') as HTMLDivElement;
//   enterBtn.addEventListener('click', async () => {
//     let result: HomeMsgStruct;
//     try {
//       const name = prompt('输入房间暗号');
//       if (!name) return;
//       result = await netPlayer.wantJoinHome(name) as HomeMsgStruct;
//       __DEV__ && console.log(result);
//     } catch (e) {
//       console.log(e);
//     }
//     result && enterGame(result);
//   });
//   const fastBtn = document.querySelector('#fastBtn') as HTMLDivElement;
//   fastBtn.addEventListener('click', async () => {
//     let result: HomeMsgStruct;
//     try {
//       result = await netPlayer.wantJoinHome() as HomeMsgStruct;
//       __DEV__ && console.log(result);
//     } catch (e) {
//       console.log(e);
//     }
//     result && enterGame(result);
//   })
// }

// export function renderHole() {
//   body.innerText = '加载中';
//   homeTargetItem.classList.contains('second') ? renderRank() : renderHome();
// }

// const body = document.body.querySelector('#homeBody') as HTMLDivElement;

// async function renderHome() {
//   const e = await netPlayer.wantHomeList() as ListToBStruct;
//   let data = e.data;


//   if (data.length === 0) {
//     body.innerText = '目前没有房间';
//   } else {
//     body.innerHTML = '<div class="home-item"><div class="master">房主</div><div class="count">当前人数</div></div>';
//     for (const home of data) {
//       const dom = document.createElement('div');
//       dom.className = 'home-item';
//       dom.innerHTML = `<div class="master"></div><div class="count"></div>`;
//       (<HTMLDivElement>dom.querySelector('.master')).innerText = home.masterName as unknown as string;
//       (<HTMLDivElement>dom.querySelector('.count')).innerText = home.users.length as unknown as string;
//       dom.addEventListener('click', async () => {
//         let result: HomeMsgStruct;
//         try {
//           result = await netPlayer.wantJoinHome(home.token) as HomeMsgStruct;
//           __DEV__ && console.log(result);
//         } catch (e) {
//           console.log(e);
//         }
//         result && enterGame(result);
//       });
//       body.appendChild(dom);
//     }
//   }
// }
// async function renderRank() {
//   const e = await netPlayer.wantRankList() as RankToBStruct;

//   body.innerHTML = '<div class="rank-item"><div class="name">昵称</div><div class="score">得分</div><div class="rank">排名</div></div>';

//   const dom = document.createElement('div');
//   dom.className = 'rank-item';
//   dom.innerHTML = `<div class="name"></div><div class="score"></div><div class="rank"></div>`;
//   (<HTMLDivElement>dom.querySelector('.name')).innerText = netPlayer.name as string;
//   (<HTMLDivElement>dom.querySelector('.score')).innerText = e.data.score as unknown as string;
//   (<HTMLDivElement>dom.querySelector('.rank')).innerText = e.data.index as unknown as string;
//   body.appendChild(dom);

//   let i = 1;
//   for (const user of e.data.list) {
//     const dom = document.createElement('div');
//     dom.className = 'rank-item';
//     dom.innerHTML = `<div class="name"></div><div class="score"></div><div class="rank"></div>`;
//     (<HTMLDivElement>dom.querySelector('.name')).innerText = user.name as string;
//     (<HTMLDivElement>dom.querySelector('.score')).innerText = user.score as unknown as string;
//     (<HTMLDivElement>dom.querySelector('.rank')).innerText = (i++) as unknown as string;
//     body.appendChild(dom);
//   }

// }
// function enterGame(result: HomeMsgStruct) {
//   const homepage = document.body.querySelector('.home');
//   homepage.classList.add('hide');
//   beginGame(result);
// }
import { ListPage } from "./list";
import { RankPage } from "./rank";

export function HomePage() {
  return <>
    <ListPage></ListPage>
    <RankPage></RankPage>
  </>
}