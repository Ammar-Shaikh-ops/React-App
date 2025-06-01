import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);


  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    if (editId !== null) {
      setItems(items.map(item => (item.id === editId ? { ...item, text: input } : item)));
      setEditId(null);
    } else {
      setItems([...items, { id: Date.now(), text: input }]);
    }
    setInput('');
  };

  const handleEdit = (id) => {
    const item = items.find(i => i.id === id);
    setInput(item.text);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setItems(items.filter(i => i.id !== id));
    if (editId === id) {
      setEditId(null);
      setInput('');
    }
  };

  return (
    <div className="app-container">
      <h1>React CRUD Application - 02</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddOrUpdate(); }}
        />
        <button onClick={handleAddOrUpdate}>{editId !== null ? 'Update' : 'Add'}</button>
      </div>

      <ul className="item-list">
        {items.length === 0 && <p className="empty-msg">No items yet. Add some!</p>}
        {items.map(item => (
          <li key={item.id} className="item">
            <span>{item.text}</span>
            <div>
              <button className="edit-btn" onClick={() => handleEdit(item.id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
