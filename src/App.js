import React, { useState, useEffect } from 'react';
import './App.css';

// Simulated API
const api = {
  fetchItems: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(JSON.parse(localStorage.getItem('items') || '[]')), 500)
    ),

  addItem: (item) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const newItems = [...items, item];
        localStorage.setItem('items', JSON.stringify(newItems));
        resolve(item);
      }, 500);
    }),

  updateItem: (updatedItem) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const newItems = items.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );
        localStorage.setItem('items', JSON.stringify(newItems));
        resolve(updatedItem);
      }, 500);
    }),

  deleteItem: (id) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const newItems = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(newItems));
        resolve(id);
      }, 500);
    }),
};

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load items from API on mount
  useEffect(() => {
    setLoading(true);
    api.fetchItems()
      .then(data => setItems(data))
      .catch(() => setError('Failed to load items'))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setInput('');
    setEditId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (editId !== null) {
        // Update
        const updatedItem = { id: editId, text: input };
        await api.updateItem(updatedItem);
        setItems(items.map(item => (item.id === editId ? updatedItem : item)));
      } else {
        // Add
        const newItem = { id: Date.now(), text: input };
        await api.addItem(newItem);
        setItems([...items, newItem]);
      }
      resetForm();
    } catch {
      setError('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const item = items.find(i => i.id === id);
    setInput(item.text);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteItem(id);
      setItems(items.filter(i => i.id !== id));
      if (editId === id) resetForm();
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
