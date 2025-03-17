require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});


app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


app.get('/users/:id', (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});


app.post('/users', (req, res) => {
    const { name, age } = req.body;
    db.query("INSERT INTO users (name, age) VALUES (?, ?)", [name, age], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name, age });
    });
});


app.put('/users/:id', (req, res) => {
    const { name, age } = req.body;
    db.query("UPDATE users SET name = ?, age = ? WHERE id = ?", [name, age, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated successfully" });
    });
});


app.delete('/users/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    });
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));




