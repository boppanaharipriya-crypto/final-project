const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect database
const db = new sqlite3.Database('./database.db', (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
`);

// Create tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        status TEXT
    )
`);

// Register user
app.post('/register', (req, res) => {

    const { username, password } = req.body;

    const sql = `
        INSERT INTO users(username, password)
        VALUES (?, ?)
    `;

    db.run(sql, [username, password], function(err) {

        if (err) {
            res.status(500).send('Registration failed');
        } else {
            res.send('User registered successfully');
        }
    });
});

// Add task
app.post('/add-task', (req, res) => {

    const { task } = req.body;

    const sql = `
        INSERT INTO tasks(task, status)
        VALUES (?, ?)
    `;

    db.run(sql, [task, 'Pending'], function(err) {

        if (err) {
            res.status(500).send('Task creation failed');
        } else {
            res.send('Task added successfully');
        }
    });
});

// Get tasks
app.get('/tasks', (req, res) => {

    db.all('SELECT * FROM tasks', [], (err, rows) => {

        if (err) {
            throw err;
        }

        res.json(rows);
    });
});

// Delete task
app.delete('/delete-task/:id', (req, res) => {

    const id = req.params.id;

    db.run(
        'DELETE FROM tasks WHERE id=?',
        [id],
        function(err) {

            if (err) {
                res.status(500).send('Delete failed');
            } else {
                res.send('Task deleted');
            }
        }
    );
});

// Start server
app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);
});