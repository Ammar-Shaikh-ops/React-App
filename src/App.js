import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5'; // fetch first 5 todos

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch real data on mount
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // Map fetched data to {id, text}
        const mappedItems = data.map(todo => ({
          id: todo.id,
          text: todo.title,
        }));
        setItems(mappedItems);
      })
      .catch(() => setError('Failed to load items from API'))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setInput('');
    setEditId(null);
  };

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    if (editId !== null) {
      // Update locally only (no real API update)
      const updatedItem = { id: editId, text: input };
      setItems(items.map(item => (item.id === editId ? updatedItem : item)));
      resetForm();
    } else {
      // Add locally only (no real API add)
      const newItem = { id: Date.now(), text: input };
      setItems([...items, newItem]);
      resetForm();
    }
  };

  const handleEdit = (id) => {
    const item = items.find(i => i.id === id);
    setInput(item.text);
    setEditId(id);
  };

  const handleDelete = (id) => {
    // Delete locally only (no real API delete)
    setItems(items.filter(i => i.id !== id));
    if (editId === id) resetForm();
  };

  return (
    <div className="app-container">
      <h1>React CRUD Application</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddOrUpdate(); }}
          disabled={loading}
        />
        <button onClick={handleAddOrUpdate} disabled={loading || !input.trim()}>
          {editId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p className="loading">Loading...</p>}

      {!loading && items.length === 0 && <p className="empty-msg">No items yet. Add some!</p>}

      <ul className="item-list">
        {items.map(item => (
          <li key={item.id} className="item">
            <span>{item.text}</span>
            <div>
              <button className="edit-btn" onClick={() => handleEdit(item.id)} disabled={loading}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(item.id)} disabled={loading}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
