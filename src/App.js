import React, { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = "";
    if (page === "users") url = "https://jsonplaceholder.typicode.com/users";
    else if (page === "posts") url = "https://jsonplaceholder.typicode.com/posts";
    else if (page === "todos") url = "https://jsonplaceholder.typicode.com/todos";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (page === "users") setUsers(data);
        else if (page === "posts") setPosts(data);
        else if (page === "todos") setTodos(data);
      })
      .catch(() => {
        setLoading(false);
        setError("Failed to fetch data.");
      });
  }, [page]);

  const startAdd = () => {
    setFormData({});
    setEditingId(null);
    setIsAdding(true); 
  };
const [isAdding, setIsAdding] = useState(false);

  const startEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);

  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      if (page === "users") {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
        );
      } else if (page === "posts") {
        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
        );
      } else if (page === "todos") {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...formData } : t))
        );
      }
    } else {
      const newItem = { ...formData, id: Date.now() };
      if (page === "users") setUsers((prev) => [newItem, ...prev]);
      else if (page === "posts") setPosts((prev) => [newItem, ...prev]);
      else if (page === "todos") setTodos((prev) => [newItem, ...prev]);
    }
    setFormData({});
    setEditingId(null);
    setIsAdding(false);
  };

  const renderTable = () => {
    if (loading) return <p style={{ fontStyle: "italic" }}>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    if (page === "users") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.row}>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.website}</td>
                <td>
                  <button style={styles.editBtn} onClick={() => startEdit(u)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (page === "posts") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} style={styles.row}>
                <td>{p.title}</td>
                <td>{p.body}</td>
                <td>
                  <button style={styles.editBtn} onClick={() => startEdit(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (page === "todos") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((t) => (
              <tr key={t.id} style={styles.row}>
                <td>{t.title}</td>
                <td>{t.completed ? "✅" : "❌"}</td>
                <td>
                  <button style={styles.editBtn} onClick={() => startEdit(t)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  const renderFormFields = () => {
    if (page === "users") {
      return (
        <>
          <label style={styles.label}>
            Name:
            <input
              style={styles.input}
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="Enter name"
              required
            />
          </label>
          <label style={styles.label}>
            Username:
            <input
              style={styles.input}
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </label>
          <label style={styles.label}>
            Email:
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
            />
          </label>
          <label style={styles.label}>
            Phone:
            <input
              style={styles.input}
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="Enter phone"
            />
          </label>
          <label style={styles.label}>
            Website:
            <input
              style={styles.input}
              name="website"
              value={formData.website || ""}
              onChange={handleInputChange}
              placeholder="Enter website"
            />
          </label>
        </>
      );
    } else if (page === "posts") {
      return (
        <>
          <label style={styles.label}>
            Title:
            <input
              style={styles.input}
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              placeholder="Enter title"
              required
            />
          </label>
          <label style={styles.label}>
            Body:
            <textarea
              style={{ ...styles.input, height: "100px" }}
              name="body"
              value={formData.body || ""}
              onChange={handleInputChange}
              placeholder="Enter body"
              required
            />
          </label>
        </>
      );
    } else if (page === "todos") {
      return (
        <>
          <label style={styles.label}>
            Title:
            <input
              style={styles.input}
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              placeholder="Enter title"
              required
            />
          </label>
          <label style={styles.label}>
            Completed:
            <select
              style={styles.input}
              name="completed"
              value={
                formData.completed === undefined ? "" : formData.completed.toString()
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  completed: e.target.value === "true",
                }))
              }
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </>
      );
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>My React App</h2>
        <ul style={styles.navList}>
          {["users", "posts", "todos"].map((p) => (
            <li
              key={p}
              onClick={() => {
                setPage(p);
                setEditingId(null);
                setFormData({});
              }}
              style={{
                ...styles.navItem,
                ...(page === p ? styles.navItemActive : {}),
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.heading}>
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </h1>
          <button style={styles.addBtn} onClick={startAdd}>
            + Add New
          </button>
        </header>

        {(editingId !== null ||isAdding) && (
          <section style={styles.formSection}>
            <h3>
              {editingId ? "Edit" : "Add New"} {page.slice(0, -1)}
            </h3>
            <form style={styles.form} onSubmit={handleSubmit}>
              {renderFormFields()}
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button type="submit" style={styles.submitBtn}>
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    style={styles.cancelBtn}
                    onClick={() => {
                      setEditingId(null);
                      setFormData({});
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section style={{ marginTop: 24 }}>{renderTable()}</section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f5f7fa",
    color: "#333",
  },
  sidebar: {
    width: 220,
    background: "#2c3e50",
    color: "white",
    padding: "20px 15px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    letterSpacing: 1,
  },
  navList: {
    listStyleType: "none",
    padding: 0,
  },
  navItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: 6,
    marginBottom: 10,
    fontWeight: 500,
    transition: "background-color 0.3s ease",
  },
  navItemActive: {
    backgroundColor: "#2980b9",
  },
  main: {
    flexGrow: 1,
    padding: 25,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
 
},
heading: {
margin: 0,
fontSize: 28,
color: "#34495e",
},
addBtn: {
backgroundColor: "#27ae60",
color: "white",
border: "none",
padding: "10px 18px",
fontSize: 16,
fontWeight: "bold",
borderRadius: 6,
cursor: "pointer",
boxShadow: "0 4px 8px rgba(39, 174, 96, 0.3)",
transition: "background-color 0.3s ease",
},
formSection: {
background: "white",
padding: 20,
borderRadius: 8,
boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
maxWidth: 600,
},
form: {
display: "flex",
flexDirection: "column",
},
label: {
marginBottom: 12,
fontWeight: "600",
},
input: {
marginTop: 6,
padding: 10,
borderRadius: 5,
border: "1px solid #ccc",
fontSize: 14,
width: "100%",
boxSizing: "border-box",
},
submitBtn: {
backgroundColor: "#2980b9",
color: "white",
border: "none",
padding: "10px 18px",
fontSize: 16,
borderRadius: 6,
cursor: "pointer",
fontWeight: "bold",
boxShadow: "0 4px 8px rgba(41, 128, 185, 0.3)",
transition: "background-color 0.3s ease",
},
cancelBtn: {
backgroundColor: "#e74c3c",
color: "white",
border: "none",
padding: "10px 18px",
fontSize: 16,
borderRadius: 6,
cursor: "pointer",
fontWeight: "bold",
boxShadow: "0 4px 8px rgba(231, 76, 60, 0.3)",
transition: "background-color 0.3s ease",
},
table: {
width: "100%",
borderCollapse: "collapse",
},
row: {
borderBottom: "1px solid #ddd",
},
editBtn: {
backgroundColor: "#f39c12",
color: "white",
border: "none",
padding: "6px 12px",
fontSize: 14,
borderRadius: 5,
cursor: "pointer",
transition: "background-color 0.3s ease",
},
};
