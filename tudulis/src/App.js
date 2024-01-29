import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

const AppContext = createContext();

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('all');
  const [filter, setFilter] = useState('all');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = {
        text: newTask,
        category,
        completed: false, 
      };
      setTasks(updatedTasks);
      setNewTask('');
      setEditIndex(null);
    } else {
      if (newTask.trim() !== '') {
        setTasks([...tasks, { text: newTask, category, completed: false }]);
        setNewTask('');
      }
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    setEditIndex(index);
    setNewTask(tasks[index].text);
    setCategory(tasks[index].category);
  };

  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], completed: !updatedTasks[index].completed };
    setTasks(updatedTasks);
  };

  const filterTasks = () => {
    if (filter === 'all') {
      return tasks;
    } else if (filter === 'finished') {
      return tasks.filter((task) => task.completed);
    } else if (filter === 'unfinished') {
      return tasks.filter((task) => !task.completed);
    } else {
      return tasks.filter((task) => task.category === filter);
    }
  };

  return (
    <AppContext.Provider value={{ category, setCategory, filter, setFilter }}>
      <div className="App">
        <h1>Simple To-Do List</h1>
        <div>
          <input
            type="text"
            placeholder="Add or edit a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="hobby">Hobby</option>
          </select>
          <button onClick={addTask}>
            {editIndex !== null ? 'Edit' : 'Add'}
          </button>
        </div>
        <div>
          <label>Filter by: </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="finished">Finished</option>
            <option value="unfinished">Unfinished</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="hobby">Hobby</option>
          </select>
        </div>
        <ul>
          {filterTasks().map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(index)}
              />
              {task.text} - {task.category}
              <div>
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppContext.Provider>
  );
}
function useAppContext() {
  return useContext(AppContext);
}

export { App as default, useAppContext };
