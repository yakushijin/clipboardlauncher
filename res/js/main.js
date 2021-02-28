import React from "react";
import ReactDOM from "react-dom";

import { Clipboard, clipboardWindowClose } from "./view/Clipboard";
import { Shortcut, shortcutWindowClose } from "./view/Shortcut";
import { Template } from "./view/Template";

import styled, { createGlobalStyle } from "styled-components";

import { DndPage } from "./view/DndPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const GlobalStyle = createGlobalStyle`
  html{
    border-top: 4px solid #d8dcdc;
  border-right: 4px solid #666;
  border-bottom: 4px solid #333;
  border-left: 4px solid #868888;
    box-sizing: border-box;
    height:100%;
    overflow:hidden;
  }
  body {
    background:-webkit-linear-gradient(top, #f5f5f5,#a1a1a1);
    color:#000;
    margin:0;
    padding:0;
    height: 100%;
  }
`;

function ClipboardEntry() {
  // window.addEventListener("mousemove", ClipboardWindowClose);
  clipboardWindowClose();

  return (
    <React.Fragment>
      <GlobalStyle />
      <Clipboard />
    </React.Fragment>
  );
}

if (document.getElementById("clipboardApp")) {
  ReactDOM.render(<ClipboardEntry />, document.getElementById("clipboardApp"));
}

function ShortcutEntry() {
  shortcutWindowClose();

  return (
    <React.Fragment>
      <GlobalStyle />
      <Shortcut />
    </React.Fragment>
  );
}

if (document.getElementById("shortcutApp")) {
  ReactDOM.render(<ShortcutEntry />, document.getElementById("shortcutApp"));
}

function TemplateEntry() {
  return <Template />;
}

if (document.getElementById("templateApp")) {
  ReactDOM.render(<TemplateEntry />, document.getElementById("templateApp"));
}

function Dndtest() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyle />
      <DndPage />
    </DndProvider>
  );
}

if (document.getElementById("dndtest")) {
  ReactDOM.render(<Dndtest />, document.getElementById("dndtest"));
}
