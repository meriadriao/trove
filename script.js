const timerState = {
  isRunning: false,
  currentMode: 'focus', 
  timeLeft: 25 * 60,
  focusTime: 25 * 60, 
  breakTime: 5 * 60,
  intervalId: null,
};

const todoState = {
  items: [],
  isListOpen: false,
};

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const focusBtn = document.getElementById('focus-mode');
const breakBtn = document.getElementById('break-mode');
const resetBtn = document.getElementById('reset-mode');

const plansToday = document.getElementById('plans-today');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const todoItems = document.getElementById('todo-items');
const editListBtn = document.getElementById('edit-list-btn');

updateDisplay();

focusBtn.addEventListener('click', switchToFocus);
breakBtn.addEventListener('click', switchToBreak);
resetBtn.addEventListener('click', resetTimer);

document.querySelector('.timer-display').addEventListener('click', toggleTimer);

// To-do list functionality
editListBtn.addEventListener('click', toggleTodoList);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim()) {
    addTodoItem(todoInput.value.trim());
    todoInput.value = '';
  }
});

function updateDisplay() {
  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;
  
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function toggleTimer() {
  if (timerState.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (timerState.isRunning || timerState.timeLeft <= 0) return;
  
  timerState.isRunning = true;
  updateButtonText();
  
  timerState.intervalId = setInterval(() => {
    timerState.timeLeft--;
    updateDisplay();
    
    if (timerState.timeLeft <= 0) {
      timerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!timerState.isRunning) return;
  
  timerState.isRunning = false;
  clearInterval(timerState.intervalId);
  updateButtonText();
}

function resetTimer() {
  pauseTimer();
  timerState.currentMode = 'focus';
  timerState.timeLeft = timerState.focusTime;
  updateModeButtons();
  updateDisplay();
}

function switchToFocus() {
  if (timerState.currentMode === 'focus') {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  } else {
    pauseTimer();
    timerState.currentMode = 'focus';
    timerState.timeLeft = timerState.focusTime;
    updateModeButtons();
    updateDisplay();
    startTimer();
  }
}

function switchToBreak() {
  if (timerState.currentMode === 'break') {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  } else {
    pauseTimer();
    timerState.currentMode = 'break';
    timerState.timeLeft = timerState.breakTime;
    updateModeButtons();
    updateDisplay();
    startTimer();
  }
}

function updateModeButtons() {
  focusBtn.classList.toggle('active', timerState.currentMode === 'focus');
  breakBtn.classList.toggle('active', timerState.currentMode === 'break');
  updateButtonText();
}

function updateButtonText() {
  if (timerState.currentMode === 'focus') {
    focusBtn.textContent = timerState.isRunning ? 'PAUSE' : 'FOCUS';
  } else if (timerState.currentMode === 'break') {
    breakBtn.textContent = timerState.isRunning ? 'PAUSE' : 'BREAK';
  }
}

function timerComplete() {
  pauseTimer();
  playNotification();
  
  if (timerState.currentMode === 'focus') {
    switchToBreak();
  } else {
    switchToFocus();
  }
}

function playNotification() {
  console.log('Time\'s up!');
}

// To-do list functions
function toggleTodoList() {
  todoState.isListOpen = !todoState.isListOpen;
  todoList.classList.toggle('hidden');
  
  if (todoState.isListOpen) {
    todoInput.focus();
  }
}

function addTodoItem(text) {
  const item = {
    id: Date.now(),
    text: text,
    completed: false,
  };
  
  todoState.items.push(item);
  updateTaskDisplay();
  renderTodoItems();
}

function deleteTodoItem(id) {
  todoState.items = todoState.items.filter(item => item.id !== id);
  updateTaskDisplay();
  renderTodoItems();
}

function toggleTodoItem(id) {
  const item = todoState.items.find(item => item.id === id);
  if (item) {
    item.completed = !item.completed;
    updateTaskDisplay();
    renderTodoItems();
  }
}

function updateTaskDisplay() {
  const incompleteTasks = todoState.items.filter(item => !item.completed);
  
  if (incompleteTasks.length > 0) {
    plansToday.textContent = incompleteTasks[0].text;
    plansToday.classList.add('has-task');
  } else {
    plansToday.textContent = 'Plans for today?';
    plansToday.classList.remove('has-task');
  }
}

function renderTodoItems() {
  todoItems.innerHTML = '';
  
  todoState.items.forEach(item => {
    const li = document.createElement('li');
    li.className = `todo-item ${item.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${item.completed ? 'checked' : ''}
        aria-label="Mark task as complete"
      />
      <span class="todo-text">${item.text}</span>
      <button class="todo-delete" aria-label="Delete task">✕</button>
    `;
    
    const checkbox = li.querySelector('.todo-checkbox');
    const deleteBtn = li.querySelector('.todo-delete');
    
    checkbox.addEventListener('change', () => toggleTodoItem(item.id));
    deleteBtn.addEventListener('click', () => deleteTodoItem(item.id));
    
    todoItems.appendChild(li);
  });
}
