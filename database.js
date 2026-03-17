const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('✅ Connected to SQLite database.');

        // Initialize the memories table
        db.run(`
            CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT,
                mediaUrl TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('✅ Memories table initialized.');
            }
        });
    }
});

module.exports = db;
