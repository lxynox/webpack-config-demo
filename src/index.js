import React from "react";
import ReactDOM from "react-dom";
import Counter from "./Counter";

import bg from "./bg.gif";
import "./main.scss";

const App = () => (
  <div
    style={{
      height: "100vh",
      background: `url(${bg}) no-repeat center`
    }}
  >
    <Counter />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
