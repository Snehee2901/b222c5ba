import "./css/body.css";
import "./css/app.css";
import "./css/header.css";
import ReactDOM from "react-dom";
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import ActivityDetail from "./components/ActivityDetail.jsx";
import Header from "./Header.jsx";

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" Component={App} />
          <Route path={"/activityDetail/:id"} Component={ActivityDetail} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById("app"));
