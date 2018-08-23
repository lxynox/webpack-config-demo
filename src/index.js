import React from "react";
import ReactDOM from "react-dom";
import Gallary from "./components/Gallary";

import "./main.scss";
import photosJson from './photos.json'

const App = () => (
  <div className="container">
    <Gallary photos={photosJson} />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
