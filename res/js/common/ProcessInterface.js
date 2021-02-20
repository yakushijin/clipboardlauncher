import React from "react";

export function initDataGet(setData) {
  ipcRenderer.invoke("some-name").then((result) => {
    setData(result);
    console.log(1);
  });
}

export function dataSet() {
  ipcRenderer.invoke("set", { message: "hello" });
}
