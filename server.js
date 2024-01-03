// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const db = new sqlite3.Database('./sudoku.db', (err) => {
if (err) {
 console.error(err.message);
 }
 console.log('Connected to the SQLite database.');
});
db.run(`CREATE TABLE IF NOT EXISTS game_state (
 session_id TEXT PRIMARY KEY,
 state TEXT,
 status TEXT,
 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
app.post('/save-game', (req, res) => {
const { sessionId, state, status } = req.body;
 db.run(`INSERT INTO game_state (session_id, state, status)
 VALUES (?, ?, ?)
 ON CONFLICT(session_id)
 DO UPDATE SET state = ?, status = ?`,
 [sessionId, JSON.stringify(state), status, JSON.stringify(state), status],
function(err) {
if (err) {
 res.status(500).send(err.message);
return;
 }
 res.send({ message: 'Game state saved', sessionId: sessionId });
 });
});
// In your Node.js server
app.get('/game/:sessionId', (req, res) => {
const sessionId = req.params.sessionId;
 db.get(`SELECT state FROM game_state WHERE session_id = ?`, [sessionId], (err, row) => {
if (err) {
 res.status(500).send(err.message);
return;
 }
if (row) {
 res.json({ state: JSON.parse(row.state) });
 } else {
 res.status(404).send('Game not found');
 }
 });
});
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
