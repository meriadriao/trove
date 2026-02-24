import { useState } from "react";
import "./index.css";

function App() {
  return (
    <>
      <div className="pomodoro">
        <div className="toolbar">
          <div className="settings">
            <button id="settings-button" type="button" aria-label="Settings">
              <img src="src\assets\button-settings.png" alt="Settings" />
            </button>
            <div className="settings-menu">
              <div className="setting-header">
                <h2>Settings</h2>
                <button
                  id="close-settings-button"
                  type="button"
                  aria-label="Close Settings"
                >
                  X
                </button>
              </div>
              <div className="setting-content">
                <div className="setting-item">/* notifications toggle; */</div>
                <div className="setting-item">
                  <label htmlFor="setting-label">Night Mode </label>
                  <select id="night-mode-select">
                    <option value="off">Off</option>
                    <option value="on">On</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="setting-label">Font </label>
                  <select id="font-select">
                    <option value="funnel-display">Funnel Display</option>
                    <option value="pixelify-sans">Pixelify Sans</option>
                  </select>
                </div>
                <hr />
                <div className="setting-item">
                  <label htmlFor="setting-label">Focus Duration (minutes) </label>
                  <input
                    type="number"
                    id="pomodoro-duration"
                    min="1"
                    max="120"
                    value="25"
                  />
                </div>
                <div className="setting-item">
                  <label htmlFor="setting-label">Break Duration (minutes) </label>
                  <input
                    type="number"
                    id="short-break-duration"
                    min="1"
                    max="60"
                    value="5"
                  />
                </div>
              </div>
            </div>
          </div>
          <h1 className="plans-today" aria-label="Plans for today">Plans for today</h1>
          <button id="edit-list-button" type="button" aria-label="Edit task list"><img src="src\assets\button-edit.png" alt="Edit task list" /></button>
        </div>
        <div className="timer"></div>
          <div className="timer-wrapper">
            <div className="timer-display">
              <span id="minutes">25</span>
              <span id="separator">:</span>
              <span id="seconds">00</span>
            </div>
          </div>
          <div className="timer-controls">
            <button className="mode-button active" id="focus-mode" type="button" aria-label="Start timer">FOCUS</button>
            <button className="mode-button" id="break-mode" type="button" aria-label="Pause timer">BREAK</button>
            <button className="mode-button" id="reset-mode" type="button" aria-label="Reset timer">RESET</button>
          </div>
        <div className="shelf"></div>
      </div>
    </>
  );
}

export default App;
