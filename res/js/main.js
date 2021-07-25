import React from "react";
import ReactDOM from "react-dom";

import { ClipboardView } from "./view/ClipboardView";
import { ShortcutView } from "./view/ShortcutView";
import { TemplateView } from "./view/TemplateView";
import { AppSettingView } from "./view/AppSettingView";
import { windowClose } from "./common/ProcessInterface";
import { CommonApi as ClipboardApi } from "./const/ClipboardConst";
import { CommonApi as ShortcutApi } from "./const/ShortcutConst";
import { CommonApi as TemplateApi } from "./const/TemplateConst";

import styled, { createGlobalStyle } from "styled-components";

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
    background:#fff;
    color:#000;
    margin:0;
    padding:0;
    height: 100%;
  }
`;

const AppSettingGlobalStyle = createGlobalStyle`
  html{
    height:100%;
    overflow:hidden;
  }
  body {
    background:#f5f5f5;
    margin:10;
    padding:10;
    height: 100%;
  }
  .app {
    height: 100%;
  }
`;

function ClipboardEntry() {
  windowClose(ClipboardApi.getDispSize, ClipboardApi.windowClose);

  return (
    <React.Fragment>
      <GlobalStyle />
      <ClipboardView />
    </React.Fragment>
  );
}

if (document.getElementById("clipboardApp")) {
  ReactDOM.render(<ClipboardEntry />, document.getElementById("clipboardApp"));
}

function ShortcutEntry() {
  windowClose(ShortcutApi.getDispSize, ShortcutApi.windowClose);

  return (
    <React.Fragment>
      <GlobalStyle />
      <ShortcutView />
    </React.Fragment>
  );
}

if (document.getElementById("shortcutApp")) {
  ReactDOM.render(<ShortcutEntry />, document.getElementById("shortcutApp"));
}

function TemplateEntry() {
  windowClose(TemplateApi.getDispSize, TemplateApi.windowClose);

  return (
    <React.Fragment>
      <GlobalStyle />
      <TemplateView />
    </React.Fragment>
  );
}

if (document.getElementById("templateApp")) {
  ReactDOM.render(<TemplateEntry />, document.getElementById("templateApp"));
}

function AppSettingEntry() {
  return (
    <React.Fragment>
      <AppSettingGlobalStyle />
      <AppSettingView />
    </React.Fragment>
  );
}

if (document.getElementById("appSettingApp")) {
  ReactDOM.render(
    <AppSettingEntry />,
    document.getElementById("appSettingApp")
  );
}
