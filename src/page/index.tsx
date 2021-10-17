import { useState } from "react";
import { render } from "react-dom";
import { HomePage } from "./home";
import { LoginPage } from "./login";
import "./login.css";

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
  return (
    <>
      {logining ? (<LoginPage dispose={endLogin}></LoginPage>) : null}
      {(!logining && !fighting) ? <HomePage></HomePage> : null}
      <canvas className={fighting ? "" : "hide"}></canvas>
    </>
  )
}