export function initDataGet(getDbData, data, setData) {
  if (data.length == 0) {
    ipcRenderer.invoke(getDbData).then((result) => {
      setData(result);
    });
  }
}

export function dataSet() {
  ipcRenderer.invoke("set", { message: "hello" });
}

export function windowClose(getDispSize, windowClose) {
  const WindowCloseXYValue = 20;
  ipcRenderer.invoke(getDispSize).then((result) => {
    window.addEventListener("mousemove", (event) => {
      if (result.autoClose) {
        if (
          event.clientX < WindowCloseXYValue ||
          event.clientY < WindowCloseXYValue ||
          event.clientX > result.x - WindowCloseXYValue ||
          event.clientY > result.y - WindowCloseXYValue
        ) {
          ipcRenderer.invoke(windowClose);
        }
      }
    });
  });
}
