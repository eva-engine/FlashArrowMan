import { useEffect } from "react";
import { netPlayer } from "../player";
import Toast from "universal-toast";

export function LoginPage({ dispose }: { dispose: () => any }) {

  useEffect(() => {
    const name = localStorage['QIANER_NAME'];
    const tel = localStorage['QIANER_TEL'];
    const time = localStorage['QIANER_TIME'];
    if (name && (time || tel)) {
      wantEnter(name, tel, time).then(bool => {
        if (bool) {
          Toast.show('自动登录成功，欢迎: ' + name);
        }
      });
    }
  }, []);

  async function wantEnter(
    name = (document.querySelector('#nameInput') as HTMLInputElement).value,
    tel = (document.querySelector('#telInput') as HTMLInputElement).value,
    time = Date.now()) {
    if (!name) {
      Toast.show('请输入昵称～')
      return
    }
    const result = await netPlayer.init(name, time, tel);
    if (result) {
      localStorage['QIANER_NAME'] = name;
      localStorage['QIANER_TEL'] = tel;
      localStorage['QIANER_TIME'] = time;
      dispose();
      return true;
    }
    return false;
  }

  return <div className="login page">
    <input type="text" id="nameInput" placeholder="请输入你的昵称" />
    <input type="tel" id="telInput" placeholder="联系方式" />
    <div className="tip">用于排行榜礼品寄送</div>
    <div id="enterBtn" onClick={() => wantEnter()}>进入大厅</div>
  </div>
}