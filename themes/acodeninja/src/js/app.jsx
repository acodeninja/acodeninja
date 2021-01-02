import React from "react";
import ReactDOM from "react-dom";
import ThemeToggle from './components/theme-toggle';
import Tracker from './components/tracker';

ReactDOM.render(
  <ThemeToggle />,
  document.getElementById('theme-toggle'),
);

ReactDOM.render(
  <Tracker />,
  document.getElementById('tracker'),
);
