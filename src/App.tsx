import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [mode, setMode] = useState("focus");
  const [isActive, setIsActive] = useState(false);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(breakDuration * 60);
      } else {
        setMode("focus");
        setTimeLeft(focusDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, focusDuration, breakDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
  };
  const handleModeClick = (newMode: "focus" | "break") => {
    if (mode === newMode) {
      // If already in this mode, toggle start/pause
      setIsActive(!isActive);
    } else {
      // If switching modes, switch and reset timer
      setIsActive(false);
      setMode(newMode);
      setTimeLeft(newMode === "focus" ? focusDuration * 60 : breakDuration * 60);
    }
  };

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
                <div className="setting-item">
                  {/* notificações */}

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
                  <label htmlFor="setting-label">
                    Focus Duration (minutes){" "}
                  </label>
                  <input
                    type="number"
                    id="focus-duration"
                    min="1"
                    max="120"
                    value={focusDuration}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFocusDuration(val);
                      if (!isActive) setTimeLeft(val * 60);
                    }}
                  />
                </div>
                <div className="setting-item">
                  <label htmlFor="setting-label">
                    Break Duration (minutes){" "}
                  </label>
                  <input
                    type="number"
                    id="short-break-duration"
                    min="1"
                    max="60"
                    value={breakDuration}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBreakDuration(val);
                      if (!isActive && mode === "break") setTimeLeft(val * 60);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <h1 className="plans-today" aria-label="Plans for today">
            Plans for today
          </h1>
          <button
            id="edit-list-button"
            type="button"
            aria-label="Edit task list"
          >
            <img src="src\assets\button-edit.png" alt="Edit task list" />
          </button>
        </div>
        <div className="timer"></div>
        <div className="timer-wrapper">
          <div className="timer-display">
            <span id="minutes">{String(minutes).padStart(2, "0")}</span>
            <span id="separator">:</span>
            <span id="seconds">{String(seconds).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="timer-controls">
          <button
            className={`mode-button ${mode === "focus" ? "active" : ""}`}
            id="focus-mode"
            type="button"
            aria-label="Focus mode"
            onClick={() => handleModeClick("focus")}
          >
            {mode === "focus" && isActive ? "PAUSE" : "FOCUS"}
          </button>
          <button
            className={`mode-button ${mode === "break" ? "active" : ""}`}
            id="break-mode"
            type="button"
            aria-label="Break mode"
            onClick={() => handleModeClick("break")}
          >
            {mode === "break" && isActive ? "PAUSE" : "BREAK"}
          </button>
          <button
            className="mode-button"
            id="reset-mode"
            type="button"
            aria-label="Reset timer"
            onClick={handleReset}
          >
            RESET
          </button>
        </div>
        <div className="shelf"></div>
      </div>
    </>
  );
}

export default App;
