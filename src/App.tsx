import { useState, useEffect, useRef, useMemo } from "react";
import "./index.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { AVAILABLE_PLANTS } from "./cacarecos";

library.add(fas, far, fab);

type PlantItem = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  price: number;
};

function App() {
  const STORAGE_KEY = "trove_state_v1";
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [mode, setMode] = useState("focus");
  const [isActive, setIsActive] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [font, setFont] = useState<string>("pixelify-sans");
  const modeRef = useRef("focus");
  const breakDurationRef = useRef(5);
  const focusDurationRef = useRef(25);
  const [leafBalance, setLeafBalance] = useState<number>(0);
  const [ownedItems, setOwnedItems] = useState<PlantItem[]>([]);
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (typeof saved.leafBalance === "number") setLeafBalance(saved.leafBalance);

      if (Array.isArray(saved.tasks)) setTasks(saved.tasks);

      if (typeof saved.focusDuration === "number") {
        setFocusDuration(saved.focusDuration);
      }

      if (typeof saved.breakDuration === "number") {
        setBreakDuration(saved.breakDuration);
      }

      if (Array.isArray(saved.ownedItems)) {
        // reconstruct owned items from AVAILABLE_PLANTS by id
        const items = saved.ownedItems
          .map((id: string) => AVAILABLE_PLANTS.find((p) => p.id === id))
          .filter(Boolean) as PlantItem[];
        setOwnedItems(items);
      }

      if (saved.mode) setMode(saved.mode);

      if (typeof saved.nightMode === "boolean") setNightMode(saved.nightMode);
      if (typeof saved.font === "string") setFont(saved.font);

      // ensure timer is not active on load; set timeLeft from saved durations/mode
      const useMode = saved.mode ?? (mode || "focus");
      const fd = saved.focusDuration ?? focusDuration;
      const bd = saved.breakDuration ?? breakDuration;
      setIsActive(false);
      setTimeLeft((useMode === "focus" ? fd : bd) * 60);
    } catch (err) {
      // ignore parse errors
      console.error("Failed to parse saved state", err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selected state to localStorage when it changes
  useEffect(() => {
    try {
      const state = {
        leafBalance,
        ownedItems: ownedItems.map((i) => i.id),
        tasks,
        focusDuration,
        breakDuration,
        mode,
        nightMode,
        font,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // ignore storage errors
      console.error("Failed to persist state", err);
    }
  // persisting nightMode and font is handled separately
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafBalance, ownedItems, tasks, focusDuration, breakDuration, mode]);

  // persist night mode and font when they change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      saved.nightMode = nightMode;
      saved.font = font;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (err) {
      // ignore, but log for debugging
      console.error("Failed to persist nightMode/font", err);
    }
  }, [nightMode, font]);

  // apply night mode class to body
  useEffect(() => {
    if (nightMode) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");
  }, [nightMode]);

  // apply font choice to body
  useEffect(() => {
    const fontMap: Record<string, string> = {
      "pixelify-sans": "Pixelify Sans, monospace",
      "funnel-display": "Verdana, sans-serif",
    };
    document.body.style.fontFamily = fontMap[font] ?? font;
  }, [font]);

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
    }
  };

  const handlePlansToggle = () => {
    const plansList = document.getElementById("plans-list");
    if (plansList) {
      plansList.classList.toggle("open");
    }
  };

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

  const [isShopOpen, setIsShopOpen] = useState(false);

  const buyItem = (item: PlantItem) => {
    if (leafBalance >= item.price) {
      setLeafBalance((prev) => prev - item.price);
      setOwnedItems((prev) => [...prev, item]);
      alert(`You bought ${item.name} for ${item.price} leafs!`);
    } else {
      alert("Not enough leafs to buy this item!");
    }
  };

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
                icon={["fas", "gear"]}
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
                  x
                </button>
              </div>
              <div className="setting-content" id="setting-content">
                <div className="setting-item">{/* notificações */}</div>
                <div className="setting-item">
                  <label htmlFor="setting-label">Night Mode </label>
                  <select
                    id="night-mode-select"
                    value={nightMode ? "on" : "off"}
                    onChange={(e) => setNightMode(e.target.value === "on")}
                  >
                    <option value="off">Off</option>
                    <option value="on">On</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="setting-label">Font </label>
                  <select
                    id="font-select"
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                  >
                    <option value="pixelify-sans">Pixel</option>
                    <option value="verdana">Sans-serif</option>
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
              icon={["fas", "pen-to-square"]}
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
              x
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
                  key={`${item.id}-${idx}`}
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
              <FontAwesomeIcon icon={["fas", "leaf"]} className="leaf-icon" />{" "}
              {leafBalance} leafs
            </div>
            <div className="shop">
              <button
                className="shop-toggle"
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                {isShopOpen ? (
                  "Close shop"
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={["fas", "bag-shopping"]}
                      className="bag-shopping-icon"
                    />{" "}
                    Buy trinkets
                  </>
                )}
              </button>
            </div>
          </div>
          {isShopOpen && (
            <div className="shop-container">
              <div className="shop-header">
                <h2>Buy trinkets</h2>
                <button
                  id="close-settings-button"
                  type="button"
                  aria-label="Close Settings"
                  onClick={() => setIsShopOpen(false)}
                >
                  x
                </button>
              </div>
              <div className="shop-grid">
                {AVAILABLE_PLANTS.map((item) => (
                  <div key={item.id} className="shop-item">
                    <img
                      src={item.src}
                      alt={item.name}
                      style={{
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                      }}
                    />
                    <div className="shop-item-info">
                      <h3>{item.name}</h3>
                      <button onClick={() => buyItem(item)}>{item.price} leafs | Buy</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default App;
