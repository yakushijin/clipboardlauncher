import React from "react";
import ReactDOM from "react-dom";

function App() {
  console.log(1);
  return <div>テスト</div>;
}

if (document.getElementById("app")) {
  console.log(1);
  ReactDOM.render(<App />, document.getElementById("app"));
}

function App2() {
  console.log(2);
  return <div>テスト２</div>;
}

if (document.getElementById("app2")) {
  console.log(2);
  ReactDOM.render(<App2 />, document.getElementById("app2"));
}
