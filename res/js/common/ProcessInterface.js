import React from "react";

export function initDataGet(setData) {
  ipcRenderer.invoke("getClipboard").then((result) => {
    setData(result);
    console.log(1);
  });
}

export function dataSet() {
  ipcRenderer.invoke("set", { message: "hello" });
}
