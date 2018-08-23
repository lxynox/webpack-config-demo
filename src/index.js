import React from "react";
import ReactDOM from "react-dom";
import Gallary from "./components/Gallary";

import "./main.scss";
import photos from './photos'

const App = () => (
  <div className="container">
    <Gallary photos={photos} />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
