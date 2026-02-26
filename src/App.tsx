import { useState, useEffect, useRef, useMemo } from "react";
import "./index.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

function App() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [mode, setMode] = useState("focus");
  const [isActive, setIsActive] = useState(false);
  const modeRef = useRef("focus");
  const breakDurationRef = useRef(5);
  const focusDurationRef = useRef(25);
  const [leafBalance, setLeafBalance] = useState<number>(0);
  const [ownedItems, setOwnedItems] = useState<PlantItem[]>([]);

  // Update refs when state changes
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    breakDurationRef.current = breakDuration;
  }, [breakDuration]);

  const handleSettingsToggle = () => {
    const menu = document.getElementById("settings-menu");
    if (menu) {
      menu.classList.toggle("open");
      setIsMenuOpen(menu.classList.contains("open"));
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePlansToggle = () => {
    const plansList = document.getElementById("plans-list");
    if (plansList) {
      plansList.classList.toggle("open");
      setIsPlansOpen(plansList.classList.contains("open"));
    }
  };
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>(
    [],
  );

  const handleTodoInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget;
      const newTask = input.value.trim();
      if (newTask) {
        setTasks((prev) => [...prev, { text: newTask, completed: false }]);
        input.value = "";
      }
    }
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTaskCompleted = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)),
    );
  };

  useEffect(() => {
    focusDurationRef.current = focusDuration;
  }, [focusDuration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (
            modeRef.current === "focus" &&
            newTime >= 0 &&
            newTime % 60 === 0
          ) {
            setLeafBalance((prevLeafs) => prevLeafs + 1);
          }

          if (newTime === 0) {
            const currentMode = modeRef.current;
            const newMode = currentMode === "focus" ? "break" : "focus";
            const duration =
              newMode === "focus"
                ? focusDurationRef.current
                : breakDurationRef.current;

            setMode(newMode);
            return duration * 60;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
  };
  const handleModeClick = (newMode: "focus" | "break") => {
    if (mode === newMode) {
      // If already in this mode, toggle start/pause
      setIsActive(!isActive);
    } else {
      setIsActive(false);
      setMode(newMode);
      setTimeLeft(
        newMode === "focus" ? focusDuration * 60 : breakDuration * 60,
      );
    }
  };

  const shelfWidth = 350;
  const shelves = useMemo(() => {
    const result: PlantItem[][] = [[]];
    let currentWidth = 0;
    let shelfIndex = 0;

    ownedItems.forEach((item) => {
      if (currentWidth + item.width > shelfWidth) {
        result.push([item]);
        shelfIndex++;
        currentWidth = item.width;
      } else {
        result[shelfIndex].push(item);
        currentWidth += item.width;
      }
    });

    return result;
  }, [ownedItems]);

  const [currentShelfPage, setCurrentShelfPage] = useState(0);

  return (
    <>
      <div className="pomodoro">
        <div className="toolbar">
          <div className="settings">
            <button
              className="settings-button"
              id="settings-button"
              type="button"
              aria-label="Settings"
              onClick={handleSettingsToggle}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-gear"
                style={{ color: "rgb(255, 255, 255)" }}
              />
            </button>
            <div className="settings-menu" id="settings-menu">
              <div className="setting-header" id="setting-header">
                <h2>Settings</h2>
                <button
                  id="close-settings-button"
                  type="button"
                  aria-label="Close Settings"
                  onClick={handleSettingsToggle}
                >
                  X
                </button>
              </div>
              <div className="setting-content" id="setting-content">
                <div className="setting-item">{/* notificações */}</div>
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
                    <option value="pixelify-sans">Pixel</option>
                    <option value="funnel-display">Sans-serif</option>
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
            className="edit-list-button"
            id="edit-list-button"
            type="button"
            aria-label="Edit task list"
            onClick={handlePlansToggle}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-pen-to-square"
              style={{ color: "rgb(255, 255, 255)" }}
            />
          </button>
        </div>

        <div className="timer">
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
        </div>

        <div className="plans-list" id="plans-list">
          <div className="plans-header" id="plans-header">
            <h2>Plans for today</h2>
            <button
              id="close-settings-button"
              type="button"
              aria-label="Close plans list"
              onClick={handlePlansToggle}
            >
              X
            </button>
          </div>
          <div id="todo-list" className="todo-list">
            <input
              type="text"
              id="todo-input"
              className="todo-input"
              placeholder="Add a new task..."
              aria-label="Add a new task"
              onKeyDown={handleTodoInput}
            />
            <ul id="todo-items" className="todo-items">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`todo-item ${task.completed ? "completed" : ""}`}
                >
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(index)}
                      aria-label={`Mark ${task.text} as completed`}
                    />
                    <span className="todo-text">{task.text}</span>
                  </label>
                  <button
                    className="todo-delete"
                    onClick={() => deleteTask(index)}
                    aria-label={`Delete task ${task.text}`}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="shelf">
          <div className="cacarecos">
            <div className="items-row">
              {shelves[currentShelfPage]?.map((item, idx) => (
                <img
                  key={"${item.id}-${idx}"}
                  src={item.src}
                  alt={item.name}
                  style={{
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="shelf-line"></div>
          <div className="shelf-menu">
            <div className="shelf-nav">
              <button
                className="shelf-nav-button"
                onClick={() =>
                  setCurrentShelfPage((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentShelfPage === 0}
              >
                {"<"}
              </button>
              <button
                className="shelf-nav-button"
                onClick={() =>
                  setCurrentShelfPage((prev) =>
                    Math.min(prev + 1, shelves.length - 1),
                  )
                }
                disabled={currentShelfPage >= shelves.length - 1}
              >
                {">"}
              </button>
            </div>
            <div className="leaf-balance">
              <FontAwesomeIcon icon="fa-solid fa-leaf" className="leaf-icon" /> {leafBalance} leafs</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
