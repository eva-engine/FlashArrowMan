import "./watchpage/index.css";
import resources from './resources';

import { resource } from '@eva/eva.js';
import { GAME_WIDTH } from './const';
import React from "react";
import { Watcher } from "./watchpage/watch";

import { initWatchPage } from "./watchpage";
window.React = React;
export const WATCH_HEIGHT = GAME_WIDTH * 1.2;
resource.addResource(resources);
export const watcher = new Watcher();
resource.preload();
(async () => {
  await watcher.init();
  initWatchPage();
})()