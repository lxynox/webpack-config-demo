import React from "react";
import ReactDOM from "react-dom";
import Counter from "./Counter";
import Gallary from "./components/Gallary";

import bg from "./bg.gif";
import "./main.scss";

const App = () => (
  <div
    style={{
      height: "100vh",
      background: `url(${bg}) no-repeat bottom`,
      display: "flex",
      justifyContent: "center"
    }}
  >
    <Gallary />
    {/* <Counter /> */}
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
