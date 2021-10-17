import "@babel/polyfill";

import React from 'react';
import { loadPage } from "./page";


window.React = React
import VConsole from 'vconsole';

new VConsole()

loadPage();