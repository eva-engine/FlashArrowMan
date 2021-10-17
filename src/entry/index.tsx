import { createElement } from "react";
import { render } from "react-dom";

export function createHome() {
    render(
        <div className="home">
            <div className="head">
                <div id="homeTargetItem"></div>
                <div className="list">
                    <div className="item">对战</div>
                    <div className="item">排行榜</div>
                </div>
            </div>
            <div id="countBoard">
                加载中。。。
            </div>
            <div className="body" id="homeBody">
            </div>
            <div className="bottom">
                <div className="item" id="enterBtn">创建房间</div>
                <div className="item" id="fastBtn">快速对局</div>
            </div>
        </div>
        , document.querySelector('.main-content'))
}