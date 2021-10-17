import { useEffect, useState } from "react";
import { render } from "react-dom";
import { HomePage } from "./home";
import { LoginPage } from "./login";
import "./login.css";
import './list.css'
import '../reset.css'
import { createGame } from "./gamebase";
import event from "../event";
export function loadPage() {
  render((
    <ReactApp></ReactApp>
  ), document.querySelector('#react-app'));
}

function ReactApp() {
  const [logining, setLogining] = useState(true);
  const [fighting, setFighting] = useState(false);
  function endLogin() {
    setLogining(false);
  }
  useEffect(() => {
    createGame(document.querySelector('canvas'))
    event.on('gameStart', () => {
      setFighting(true)
    })
    event.on('gameOver', () => {
      setFighting(false)
    })
  }, [])
  const canvasStyle = {
    width: "100vh",
    height: "100vw",
    transform: "rotate(90deg)",
    transformOrigin: "50vw",
  }
  return (
    <>
      {logining ? (<LoginPage dispose={endLogin}></LoginPage>) : null}
      {(!logining && !fighting) ? <HomePage></HomePage> : null}
      <canvas style={canvasStyle} id="canvas" width="0" height="0" className={fighting ? "" : "hide"}></canvas>
    </>
  )
}