import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Plus, X, Edit2, Check, Music, Settings, LogIn, Timer, Palette } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TimerSettings {
  workMinutes: number;
  breakMinutes: number;
}

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    workMinutes: 25,
    breakMinutes: 5
  });
  const [bgColor, setBgColor] = useState('from-gray-900 to-white');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (isWorkTime) {
      setTimeLeft(timerSettings.breakMinutes * 60);
      setIsWorkTime(false);
    } else {
      setTimeLeft(timerSettings.workMinutes * 60);
      setIsWorkTime(true);
    }
    if (selectedTaskId && isWorkTime) {
      setTasks(tasks.map(task => 
        task.id === selectedTaskId ? { ...task, completed: true } : task
      ));
      setSelectedTaskId(null);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkTime ? timerSettings.workMinutes * 60 : timerSettings.breakMinutes * 60);
  };

  const openSpotify = () => {
    window.open('https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', '_blank');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in a real app, you'd make an API call here
    if (email && password) {
      setIsLoggedIn(true);
      setShowSettings(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const updateTimerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeLeft(timerSettings.workMinutes * 60);
    setShowSettings(false);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: crypto.randomUUID(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEditingTask = () => {
    if (editingTaskId && editingText.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTaskId ? { ...task, text: editingText.trim() } : task
      ));
      setEditingTaskId(null);
      setEditingText('');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const selectTask = (taskId: string) => {
    if (!isRunning) {
      setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
    }
  };

  const backgroundColors = [
    { name: 'Black & White', value: 'from-gray-900 to-white' },
    { name: 'Blue & Red', value: 'from-blue-600 to-red-600' },
    { name: 'Red & Green', value: 'from-red-600 to-green-600' }
  ];

  return (
  
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4`}>
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white max-w-md w-full relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
        >
          <Settings size={20} />
        </button>

        {showSettings ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Timer size={20} />
                  Timer Settings
                </h3>
                <form onSubmit={updateTimerSettings} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Work Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={timerSettings.workMinutes}
                      onChange={(e) => setTimerSettings({
                        ...timerSettings,
                        workMinutes: parseInt(e.target.value) || 25
                      })}
                      className="w-full bg-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Break Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={timerSettings.breakMinutes}
                      onChange={(e) => setTimerSettings({
                        ...timerSettings,
                        breakMinutes: parseInt(e.target.value) || 5
                      })}
                      className="w-full bg-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg"
                  >
                    Save Timer Settings
                  </button>
                </form>
              </div>

              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Palette size={20} />
                  Theme Settings
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBgColor(color.value)}
                      className={`p-2 rounded-lg ${
                        bgColor === color.value ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                      } transition-colors`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <LogIn size={20} />
                  {isLoggedIn ? 'Account' : 'Login'}
                </h3>
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <p>Logged in as: {email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg"
                    >
                      Login
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center mb-8">
              {isWorkTime ? 'Focus Time' : 'Break Time'}
            </h1>
            
            <div className="text-7xl font-bold text-center mb-8 font-mono">
              {formatTime(timeLeft)}
            </div>

            {selectedTaskId && (
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Current Task:</h2>
                <p className="bg-white/20 py-2 px-4 rounded-lg">
                  {tasks.find(t => t.id === selectedTaskId)?.text}
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={toggleTimer}
                className="bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-full"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={resetTimer}
                className="bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-full"
              >
                <SkipForward size={24} />
              </button>

              <button
                onClick={openSpotify}
                className="bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-full group relative"
                aria-label="Open Spotify Focus Playlist"
              >
                <Music size={24} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Open Spotify Focus Playlist
                </div>
              </button>
            </div>

            <div className="border-t border-white/20 pt-6">
              <h2 className="text-xl font-semibold mb-4">Tasks</h2>
              
              <form onSubmit={addTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-lg"
                >
                  <Plus size={24} />
                </button>
              </form>

              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      selectedTaskId === task.id ? 'bg-white/30' : 'bg-white/10'
                    } ${task.completed ? 'opacity-50' : ''}`}
                  >
                    {editingTaskId === task.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 bg-white/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button
                          onClick={saveEditingTask}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => selectTask(task.id)}
                        >
                          <span className={task.completed ? 'line-through' : ''}>
                            {task.text}
                          </span>
                        </div>
                        <button
                          onClick={() => startEditingTask(task)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;